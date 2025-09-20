/*
  # Waste Management System Database Schema

  1. New Tables
    - `profiles` - User profiles extending Supabase auth
    - `vehicles` - Vehicle fleet management
    - `routes` - Collection routes
    - `bins` - Waste bin locations and status
    - `collections` - Waste collection records
    - `citizen_reports` - Citizen issue reports
    - `notifications` - System notifications
    - `route_assignments` - Staff route assignments
    - `collection_logs` - Collection activity logs

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Secure data access based on user roles

  3. Functions
    - Auto-create profile on user signup
    - Update timestamps automatically
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'staff', 'citizen');
CREATE TYPE vehicle_status AS ENUM ('active', 'maintenance', 'inactive');
CREATE TYPE bin_status AS ENUM ('empty', 'half-full', 'full', 'overflowing');
CREATE TYPE waste_type AS ENUM ('solid', 'recyclable', 'compost');
CREATE TYPE collection_status AS ENUM ('pending', 'in-progress', 'completed', 'missed');
CREATE TYPE report_status AS ENUM ('received', 'in-progress', 'resolved');
CREATE TYPE report_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE route_status AS ENUM ('active', 'inactive');
CREATE TYPE notification_type AS ENUM ('info', 'warning', 'error', 'success');

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'citizen',
  phone text,
  assigned_area text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plate_number text UNIQUE NOT NULL,
  capacity integer NOT NULL,
  status vehicle_status NOT NULL DEFAULT 'active',
  current_location jsonb,
  assigned_route uuid,
  last_maintenance timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Routes table
CREATE TABLE IF NOT EXISTS routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  areas text[] NOT NULL DEFAULT '{}',
  estimated_duration integer NOT NULL DEFAULT 0,
  status route_status NOT NULL DEFAULT 'active',
  bin_count integer NOT NULL DEFAULT 0,
  coordinates jsonb,
  last_optimized timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Bins table
CREATE TABLE IF NOT EXISTS bins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location text NOT NULL,
  coordinates jsonb NOT NULL,
  status bin_status NOT NULL DEFAULT 'empty',
  waste_type waste_type NOT NULL DEFAULT 'solid',
  capacity integer DEFAULT 100,
  last_collected timestamptz,
  route_id uuid REFERENCES routes(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Collections table
CREATE TABLE IF NOT EXISTS collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  area text NOT NULL,
  route_id uuid REFERENCES routes(id),
  scheduled_time timestamptz NOT NULL,
  status collection_status NOT NULL DEFAULT 'pending',
  assigned_staff uuid REFERENCES profiles(id),
  vehicle_id uuid REFERENCES vehicles(id),
  waste_type waste_type NOT NULL DEFAULT 'solid',
  coordinates jsonb NOT NULL,
  actual_start_time timestamptz,
  actual_end_time timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Citizen reports table
CREATE TABLE IF NOT EXISTS citizen_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  citizen_id uuid REFERENCES profiles(id) NOT NULL,
  location text NOT NULL,
  coordinates jsonb NOT NULL,
  description text NOT NULL,
  image_url text,
  status report_status NOT NULL DEFAULT 'received',
  priority report_priority NOT NULL DEFAULT 'medium',
  waste_type waste_type NOT NULL DEFAULT 'solid',
  assigned_to uuid REFERENCES profiles(id),
  resolved_at timestamptz,
  resolution_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type notification_type NOT NULL DEFAULT 'info',
  read boolean NOT NULL DEFAULT false,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Route assignments table
CREATE TABLE IF NOT EXISTS route_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id uuid REFERENCES routes(id) NOT NULL,
  staff_id uuid REFERENCES profiles(id) NOT NULL,
  vehicle_id uuid REFERENCES vehicles(id),
  assigned_date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'assigned',
  created_at timestamptz DEFAULT now(),
  UNIQUE(route_id, assigned_date)
);

-- Collection logs table
CREATE TABLE IF NOT EXISTS collection_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id uuid REFERENCES collections(id) NOT NULL,
  staff_id uuid REFERENCES profiles(id) NOT NULL,
  action text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  location jsonb,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bins ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE citizen_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Admins can manage all profiles"
  ON profiles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Vehicles policies
CREATE POLICY "Staff can read vehicles"
  ON vehicles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff')
    )
  );

CREATE POLICY "Admins can manage vehicles"
  ON vehicles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Routes policies
CREATE POLICY "All authenticated users can read routes"
  ON routes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage routes"
  ON routes FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Bins policies
CREATE POLICY "All authenticated users can read bins"
  ON bins FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Staff can update bin status"
  ON bins FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff')
    )
  );

CREATE POLICY "Admins can manage bins"
  ON bins FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Collections policies
CREATE POLICY "Staff can read assigned collections"
  ON collections FOR SELECT
  TO authenticated
  USING (
    assigned_staff = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Staff can update assigned collections"
  ON collections FOR UPDATE
  TO authenticated
  USING (
    assigned_staff = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Admins can manage collections"
  ON collections FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Citizen reports policies
CREATE POLICY "Citizens can read own reports"
  ON citizen_reports FOR SELECT
  TO authenticated
  USING (
    citizen_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff')
    )
  );

CREATE POLICY "Citizens can create reports"
  ON citizen_reports FOR INSERT
  TO authenticated
  WITH CHECK (citizen_id = auth.uid());

CREATE POLICY "Citizens can update own reports"
  ON citizen_reports FOR UPDATE
  TO authenticated
  USING (
    citizen_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff')
    )
  );

-- Notifications policies
CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Route assignments policies
CREATE POLICY "Staff can read own assignments"
  ON route_assignments FOR SELECT
  TO authenticated
  USING (
    staff_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Admins can manage assignments"
  ON route_assignments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Collection logs policies
CREATE POLICY "Staff can read related logs"
  ON collection_logs FOR SELECT
  TO authenticated
  USING (
    staff_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Staff can create logs"
  ON collection_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    staff_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff')
    )
  );

-- Functions
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'citizen')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE OR REPLACE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_routes_updated_at
  BEFORE UPDATE ON routes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_bins_updated_at
  BEFORE UPDATE ON bins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_citizen_reports_updated_at
  BEFORE UPDATE ON citizen_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();