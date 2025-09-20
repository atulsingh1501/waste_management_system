import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://your-project.supabase.co' && 
         supabaseAnonKey !== 'your-anon-key' &&
         supabaseUrl.includes('supabase.co');
};

// Mock authentication for development when Supabase is not configured
export const mockAuth = {
  signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUsers = {
      'admin@wms.com': { id: '11111111-1111-1111-1111-111111111111', role: 'admin', password: 'admin123' },
      'manager@wms.com': { id: '22222222-2222-2222-2222-222222222222', role: 'manager', password: 'manager123' },
      'staff@wms.com': { id: '33333333-3333-3333-3333-333333333333', role: 'staff', password: 'staff123' },
      'citizen@wms.com': { id: '44444444-4444-4444-4444-444444444444', role: 'citizen', password: 'citizen123' },
    };

    const user = mockUsers[email as keyof typeof mockUsers];
    
    if (!user || user.password !== password) {
      return { 
        data: { user: null, session: null }, 
        error: { message: 'Invalid email or password' } 
      };
    }

    const mockUser = {
      id: user.id,
      email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      email_confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      role: 'authenticated',
      aud: 'authenticated',
      user_metadata: {},
      app_metadata: {}
    };

    const mockSession = {
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      expires_in: 3600,
      expires_at: Date.now() + 3600000,
      token_type: 'bearer',
      user: mockUser
    };

    // Store in localStorage for persistence
    localStorage.setItem('mock-session', JSON.stringify(mockSession));
    
    return { 
      data: { user: mockUser, session: mockSession }, 
      error: null 
    };
  },

  getSession: async () => {
    const stored = localStorage.getItem('mock-session');
    if (stored) {
      const session = JSON.parse(stored);
      if (session.expires_at > Date.now()) {
        return { data: { session }, error: null };
      } else {
        localStorage.removeItem('mock-session');
      }
    }
    return { data: { session: null }, error: null };
  },

  signOut: async () => {
    localStorage.removeItem('mock-session');
    return { error: null };
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    // Simple mock implementation
    const checkSession = () => {
      const stored = localStorage.getItem('mock-session');
      if (stored) {
        const session = JSON.parse(stored);
        if (session.expires_at > Date.now()) {
          callback('SIGNED_IN', session);
        } else {
          localStorage.removeItem('mock-session');
          callback('SIGNED_OUT', null);
        }
      } else {
        callback('SIGNED_OUT', null);
      }
    };

    // Check immediately
    setTimeout(checkSession, 100);

    // Return mock subscription
    return {
      data: {
        subscription: {
          unsubscribe: () => {}
        }
      }
    };
  }
};

// Mock database operations
export const mockDatabase = {
  from: (table: string) => ({
    select: (columns = '*') => ({
      eq: (column: string, value: any) => ({
        single: async () => {
          // Mock user profiles
          const profiles = {
            '11111111-1111-1111-1111-111111111111': {
              id: '11111111-1111-1111-1111-111111111111',
              email: 'admin@wms.com',
              full_name: 'System Administrator',
              role: 'admin',
              phone: '+1-555-0101',
              address: '123 Admin St, City Center',
              area_id: 1,
              status: 'active',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            '22222222-2222-2222-2222-222222222222': {
              id: '22222222-2222-2222-2222-222222222222',
              email: 'manager@wms.com',
              full_name: 'Operations Manager',
              role: 'manager',
              phone: '+1-555-0102',
              address: '456 Manager Ave, Downtown',
              area_id: 1,
              status: 'active',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            '33333333-3333-3333-3333-333333333333': {
              id: '33333333-3333-3333-3333-333333333333',
              email: 'staff@wms.com',
              full_name: 'Collection Staff',
              role: 'staff',
              phone: '+1-555-0103',
              address: '789 Worker Rd, Industrial',
              area_id: 2,
              status: 'active',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            '44444444-4444-4444-4444-444444444444': {
              id: '44444444-4444-4444-4444-444444444444',
              email: 'citizen@wms.com',
              full_name: 'John Citizen',
              role: 'citizen',
              phone: '+1-555-0104',
              address: '321 Resident Ln, Suburbs',
              area_id: 3,
              status: 'active',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          };

          if (table === 'user_profiles') {
            const profile = profiles[value as keyof typeof profiles];
            return { data: profile || null, error: profile ? null : { message: 'Profile not found' } };
          }

          return { data: null, error: { message: 'Table not found' } };
        }
      })
    })
  })
};