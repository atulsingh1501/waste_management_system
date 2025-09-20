/*
  # Seed Sample Data for Waste Management System

  This migration adds sample data for development and testing purposes.
*/

-- Insert sample profiles (these will be created when users sign up)
-- The trigger will handle profile creation automatically

-- Insert sample vehicles
INSERT INTO vehicles (id, plate_number, capacity, status, current_location, last_maintenance) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'WM-001', 10000, 'active', '{"lat": 40.7128, "lng": -74.0060}', '2025-01-01T10:00:00Z'),
  ('550e8400-e29b-41d4-a716-446655440002', 'WM-002', 12000, 'active', '{"lat": 40.7589, "lng": -73.9851}', '2025-01-02T14:30:00Z'),
  ('550e8400-e29b-41d4-a716-446655440003', 'WM-003', 8000, 'maintenance', '{"lat": 40.7488, "lng": -73.9857}', '2025-01-03T09:15:00Z'),
  ('550e8400-e29b-41d4-a716-446655440004', 'WM-004', 15000, 'active', '{"lat": 40.7282, "lng": -74.0776}', '2024-12-28T11:45:00Z'),
  ('550e8400-e29b-41d4-a716-446655440005', 'WM-005', 9000, 'inactive', null, '2024-12-20T16:20:00Z');

-- Insert sample routes
INSERT INTO routes (id, name, areas, estimated_duration, status, bin_count, coordinates, last_optimized) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'Route A - Downtown', ARRAY['Downtown', 'Financial District'], 240, 'active', 45, '{"waypoints": [{"lat": 40.7128, "lng": -74.0060}, {"lat": 40.7080, "lng": -74.0020}]}', '2025-01-08T10:00:00Z'),
  ('660e8400-e29b-41d4-a716-446655440002', 'Route B - Suburbs', ARRAY['Suburbs', 'Residential North'], 180, 'active', 38, '{"waypoints": [{"lat": 40.7589, "lng": -73.9851}, {"lat": 40.7650, "lng": -73.9800}]}', '2025-01-07T14:30:00Z'),
  ('660e8400-e29b-41d4-a716-446655440003', 'Route C - Industrial', ARRAY['Industrial Park', 'Commercial Zone'], 200, 'inactive', 28, '{"waypoints": [{"lat": 40.7488, "lng": -73.9857}, {"lat": 40.7500, "lng": -73.9900}]}', '2025-01-06T11:15:00Z'),
  ('660e8400-e29b-41d4-a716-446655440004', 'Route D - Waterfront', ARRAY['Waterfront', 'Harbor District'], 220, 'active', 32, '{"waypoints": [{"lat": 40.7282, "lng": -74.0776}, {"lat": 40.7300, "lng": -74.0800}]}', '2025-01-05T09:45:00Z');

-- Insert sample bins
INSERT INTO bins (id, location, coordinates, status, waste_type, capacity, last_collected, route_id) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', '123 Main St', '{"lat": 40.7128, "lng": -74.0060}', 'full', 'solid', 100, '2025-01-07T10:30:00Z', '660e8400-e29b-41d4-a716-446655440001'),
  ('770e8400-e29b-41d4-a716-446655440002', '456 Oak Ave', '{"lat": 40.7589, "lng": -73.9851}', 'half-full', 'recyclable', 120, '2025-01-08T14:20:00Z', '660e8400-e29b-41d4-a716-446655440002'),
  ('770e8400-e29b-41d4-a716-446655440003', '789 Pine Rd', '{"lat": 40.7488, "lng": -73.9857}', 'overflowing', 'compost', 80, '2025-01-06T09:15:00Z', '660e8400-e29b-41d4-a716-446655440003'),
  ('770e8400-e29b-41d4-a716-446655440004', '321 Elm St', '{"lat": 40.7280, "lng": -74.0020}', 'empty', 'solid', 100, '2025-01-09T08:00:00Z', '660e8400-e29b-41d4-a716-446655440001'),
  ('770e8400-e29b-41d4-a716-446655440005', '654 Maple Dr', '{"lat": 40.7350, "lng": -73.9950}', 'full', 'recyclable', 120, '2025-01-07T15:45:00Z', '660e8400-e29b-41d4-a716-446655440002'),
  ('770e8400-e29b-41d4-a716-446655440006', '987 Cedar Ln', '{"lat": 40.7400, "lng": -73.9900}', 'half-full', 'solid', 100, '2025-01-08T11:30:00Z', '660e8400-e29b-41d4-a716-446655440004');

-- Update vehicle assignments
UPDATE vehicles SET assigned_route = '660e8400-e29b-41d4-a716-446655440001' WHERE id = '550e8400-e29b-41d4-a716-446655440001';
UPDATE vehicles SET assigned_route = '660e8400-e29b-41d4-a716-446655440002' WHERE id = '550e8400-e29b-41d4-a716-446655440002';
UPDATE vehicles SET assigned_route = '660e8400-e29b-41d4-a716-446655440003' WHERE id = '550e8400-e29b-41d4-a716-446655440003';
UPDATE vehicles SET assigned_route = '660e8400-e29b-41d4-a716-446655440004' WHERE id = '550e8400-e29b-41d4-a716-446655440004';