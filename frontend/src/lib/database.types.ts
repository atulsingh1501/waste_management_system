export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          role: 'admin' | 'manager' | 'staff' | 'citizen'
          phone: string | null
          assigned_area: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          role?: 'admin' | 'manager' | 'staff' | 'citizen'
          phone?: string | null
          assigned_area?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: 'admin' | 'manager' | 'staff' | 'citizen'
          phone?: string | null
          assigned_area?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      vehicles: {
        Row: {
          id: string
          plate_number: string
          capacity: number
          status: 'active' | 'maintenance' | 'inactive'
          current_location: Json | null
          assigned_route: string | null
          last_maintenance: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          plate_number: string
          capacity: number
          status?: 'active' | 'maintenance' | 'inactive'
          current_location?: Json | null
          assigned_route?: string | null
          last_maintenance?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          plate_number?: string
          capacity?: number
          status?: 'active' | 'maintenance' | 'inactive'
          current_location?: Json | null
          assigned_route?: string | null
          last_maintenance?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      routes: {
        Row: {
          id: string
          name: string
          areas: string[]
          estimated_duration: number
          status: 'active' | 'inactive'
          bin_count: number
          coordinates: Json | null
          last_optimized: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          areas?: string[]
          estimated_duration?: number
          status?: 'active' | 'inactive'
          bin_count?: number
          coordinates?: Json | null
          last_optimized?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          areas?: string[]
          estimated_duration?: number
          status?: 'active' | 'inactive'
          bin_count?: number
          coordinates?: Json | null
          last_optimized?: string
          created_at?: string
          updated_at?: string
        }
      }
      bins: {
        Row: {
          id: string
          location: string
          coordinates: Json
          status: 'empty' | 'half-full' | 'full' | 'overflowing'
          waste_type: 'solid' | 'recyclable' | 'compost'
          capacity: number | null
          last_collected: string | null
          route_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          location: string
          coordinates: Json
          status?: 'empty' | 'half-full' | 'full' | 'overflowing'
          waste_type?: 'solid' | 'recyclable' | 'compost'
          capacity?: number | null
          last_collected?: string | null
          route_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          location?: string
          coordinates?: Json
          status?: 'empty' | 'half-full' | 'full' | 'overflowing'
          waste_type?: 'solid' | 'recyclable' | 'compost'
          capacity?: number | null
          last_collected?: string | null
          route_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      collections: {
        Row: {
          id: string
          area: string
          route_id: string | null
          scheduled_time: string
          status: 'pending' | 'in-progress' | 'completed' | 'missed'
          assigned_staff: string | null
          vehicle_id: string | null
          waste_type: 'solid' | 'recyclable' | 'compost'
          coordinates: Json
          actual_start_time: string | null
          actual_end_time: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          area: string
          route_id?: string | null
          scheduled_time: string
          status?: 'pending' | 'in-progress' | 'completed' | 'missed'
          assigned_staff?: string | null
          vehicle_id?: string | null
          waste_type?: 'solid' | 'recyclable' | 'compost'
          coordinates: Json
          actual_start_time?: string | null
          actual_end_time?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          area?: string
          route_id?: string | null
          scheduled_time?: string
          status?: 'pending' | 'in-progress' | 'completed' | 'missed'
          assigned_staff?: string | null
          vehicle_id?: string | null
          waste_type?: 'solid' | 'recyclable' | 'compost'
          coordinates?: Json
          actual_start_time?: string | null
          actual_end_time?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      citizen_reports: {
        Row: {
          id: string
          citizen_id: string
          location: string
          coordinates: Json
          description: string
          image_url: string | null
          status: 'received' | 'in-progress' | 'resolved'
          priority: 'low' | 'medium' | 'high'
          waste_type: 'solid' | 'recyclable' | 'compost'
          assigned_to: string | null
          resolved_at: string | null
          resolution_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          citizen_id: string
          location: string
          coordinates: Json
          description: string
          image_url?: string | null
          status?: 'received' | 'in-progress' | 'resolved'
          priority?: 'low' | 'medium' | 'high'
          waste_type?: 'solid' | 'recyclable' | 'compost'
          assigned_to?: string | null
          resolved_at?: string | null
          resolution_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          citizen_id?: string
          location?: string
          coordinates?: Json
          description?: string
          image_url?: string | null
          status?: 'received' | 'in-progress' | 'resolved'
          priority?: 'low' | 'medium' | 'high'
          waste_type?: 'solid' | 'recyclable' | 'compost'
          assigned_to?: string | null
          resolved_at?: string | null
          resolution_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'info' | 'warning' | 'error' | 'success'
          read: boolean
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: 'info' | 'warning' | 'error' | 'success'
          read?: boolean
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: 'info' | 'warning' | 'error' | 'success'
          read?: boolean
          metadata?: Json | null
          created_at?: string
        }
      }
      route_assignments: {
        Row: {
          id: string
          route_id: string
          staff_id: string
          vehicle_id: string | null
          assigned_date: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          route_id: string
          staff_id: string
          vehicle_id?: string | null
          assigned_date?: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          route_id?: string
          staff_id?: string
          vehicle_id?: string | null
          assigned_date?: string
          status?: string
          created_at?: string
        }
      }
      collection_logs: {
        Row: {
          id: string
          collection_id: string
          staff_id: string
          action: string
          timestamp: string
          location: Json | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          collection_id: string
          staff_id: string
          action: string
          timestamp?: string
          location?: Json | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          collection_id?: string
          staff_id?: string
          action?: string
          timestamp?: string
          location?: Json | null
          notes?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'manager' | 'staff' | 'citizen'
      vehicle_status: 'active' | 'maintenance' | 'inactive'
      bin_status: 'empty' | 'half-full' | 'full' | 'overflowing'
      waste_type: 'solid' | 'recyclable' | 'compost'
      collection_status: 'pending' | 'in-progress' | 'completed' | 'missed'
      report_status: 'received' | 'in-progress' | 'resolved'
      report_priority: 'low' | 'medium' | 'high'
      route_status: 'active' | 'inactive'
      notification_type: 'info' | 'warning' | 'error' | 'success'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}