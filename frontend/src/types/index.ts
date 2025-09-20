export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'citizen' | 'manager';
  phone?: string;
  assignedArea?: string;
}

export interface WasteCollection {
  id: string;
  area: string;
  route: string;
  scheduledTime: string;
  status: 'pending' | 'in-progress' | 'completed' | 'missed';
  assignedStaff?: string;
  vehicleId?: string;
  wasteType: 'solid' | 'recyclable' | 'compost';
  coordinates: { lat: number; lng: number };
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  capacity: number;
  status: 'active' | 'maintenance' | 'inactive';
  currentLocation?: { lat: number; lng: number };
  assignedRoute?: string;
}

export interface BinStatus {
  id: string;
  location: string;
  coordinates: { lat: number; lng: number };
  status: 'empty' | 'half-full' | 'full' | 'overflowing';
  lastCollected: string;
  wasteType: 'solid' | 'recyclable' | 'compost';
}

export interface CitizenReport {
  id: string;
  citizenId: string;
  location: string;
  coordinates: { lat: number; lng: number };
  description: string;
  imageUrl?: string;
  status: 'received' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  reportedAt: string;
  assignedTo?: string;
  resolvedAt?: string;
}

export interface Route {
  id: string;
  name: string;
  areas: string[];
  estimatedDuration: number;
  status: 'active' | 'inactive';
  binCount: number;
  lastOptimized: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: string;
}