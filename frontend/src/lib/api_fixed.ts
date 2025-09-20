// src/lib/api.ts

const API_BASE_URL = 'http://localhost:3001/api';

// Authentication API functions
export async function loginUser(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) throw new Error('Login failed');
  return response.json();
}

export async function registerUser(userData: any) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  if (!response.ok) throw new Error('Registration failed');
  return response.json();
}

// User management API functions
export async function fetchUsers(token: string) {
  const response = await fetch(`${API_BASE_URL}/users`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
}

export async function updateUserRole(userId: string, newRole: string, token: string) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ role: newRole })
  });
  if (!response.ok) throw new Error('Failed to update user role');
  return response.json();
}

// Add more API functions as needed for other endpoints
