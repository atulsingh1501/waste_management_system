// src/lib/api.ts

const API_BASE_URL = 'http://localhost:3001/api';

export async function fetchUsers() {
  const response = await fetch(`${API_BASE_URL}/users`);
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
}

export async function updateUserRole(userId: string, newRole: string) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: newRole })
  });
  if (!response.ok) throw new Error('Failed to update user role');
  return response.json();
}

// Add more API functions as needed for other endpoints
