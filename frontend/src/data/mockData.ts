import { WasteCollection, Vehicle, BinStatus, CitizenReport, Route, Notification } from '../types';

export const mockCollections: WasteCollection[] = [
  {
    id: 'col-1',
    area: 'Downtown',
    route: 'Route A',
    scheduledTime: '2025-01-09T08:00:00',
    status: 'pending',
    assignedStaff: 'John Driver',
    vehicleId: 'truck-1',
    wasteType: 'solid',
    coordinates: { lat: 40.7128, lng: -74.0060 }
  },
  {
    id: 'col-2',
    area: 'Suburbs',
    route: 'Route B',
    scheduledTime: '2025-01-09T09:30:00',
    status: 'in-progress',
    assignedStaff: 'Mike Collector',
    vehicleId: 'truck-2',
    wasteType: 'recyclable',
    coordinates: { lat: 40.7589, lng: -73.9851 }
  },
  {
    id: 'col-3',
    area: 'Industrial',
    route: 'Route C',
    scheduledTime: '2025-01-09T10:00:00',
    status: 'completed',
    assignedStaff: 'Sarah Worker',
    vehicleId: 'truck-3',
    wasteType: 'compost',
    coordinates: { lat: 40.7488, lng: -73.9857 }
  }
];

export const mockVehicles: Vehicle[] = [
  {
    id: 'truck-1',
    plateNumber: 'WM-001',
    capacity: 10000,
    status: 'active',
    currentLocation: { lat: 40.7128, lng: -74.0060 },
    assignedRoute: 'Route A'
  },
  {
    id: 'truck-2',
    plateNumber: 'WM-002',
    capacity: 12000,
    status: 'active',
    currentLocation: { lat: 40.7589, lng: -73.9851 },
    assignedRoute: 'Route B'
  },
  {
    id: 'truck-3',
    plateNumber: 'WM-003',
    capacity: 8000,
    status: 'maintenance',
    assignedRoute: 'Route C'
  }
];

export const mockBins: BinStatus[] = [
  {
    id: 'bin-1',
    location: '123 Main St',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    status: 'full',
    lastCollected: '2025-01-07T10:30:00',
    wasteType: 'solid'
  },
  {
    id: 'bin-2',
    location: '456 Oak Ave',
    coordinates: { lat: 40.7589, lng: -73.9851 },
    status: 'half-full',
    lastCollected: '2025-01-08T14:20:00',
    wasteType: 'recyclable'
  },
  {
    id: 'bin-3',
    location: '789 Pine Rd',
    coordinates: { lat: 40.7488, lng: -73.9857 },
    status: 'overflowing',
    lastCollected: '2025-01-06T09:15:00',
    wasteType: 'compost'
  }
];

export const mockReports: CitizenReport[] = [
  {
    id: 'rep-1',
    citizenId: '3',
    location: '321 Elm St',
    coordinates: { lat: 40.7280, lng: -74.0020 },
    description: 'Bin not collected for 3 days, overflowing onto sidewalk',
    status: 'received',
    priority: 'high',
    reportedAt: '2025-01-09T07:30:00'
  },
  {
    id: 'rep-2',
    citizenId: '3',
    location: '654 Maple Dr',
    coordinates: { lat: 40.7350, lng: -73.9950 },
    description: 'Recyclable bin mixed with regular waste',
    status: 'in-progress',
    priority: 'medium',
    reportedAt: '2025-01-08T15:45:00',
    assignedTo: 'John Driver'
  }
];

export const mockRoutes: Route[] = [
  {
    id: 'route-a',
    name: 'Route A - Downtown',
    areas: ['Downtown', 'Financial District'],
    estimatedDuration: 240,
    status: 'active',
    binCount: 45,
    lastOptimized: '2025-01-08T10:00:00'
  },
  {
    id: 'route-b',
    name: 'Route B - Suburbs',
    areas: ['Suburbs', 'Residential North'],
    estimatedDuration: 180,
    status: 'active',
    binCount: 38,
    lastOptimized: '2025-01-07T14:30:00'
  },
  {
    id: 'route-c',
    name: 'Route C - Industrial',
    areas: ['Industrial Park', 'Commercial Zone'],
    estimatedDuration: 200,
    status: 'inactive',
    binCount: 28,
    lastOptimized: '2025-01-06T11:15:00'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'not-1',
    userId: '2',
    title: 'New Route Assignment',
    message: 'You have been assigned to Route A for today',
    type: 'info',
    read: false,
    createdAt: '2025-01-09T06:00:00'
  },
  {
    id: 'not-2',
    userId: '1',
    title: 'Vehicle Maintenance Required',
    message: 'WM-003 requires scheduled maintenance',
    type: 'warning',
    read: false,
    createdAt: '2025-01-09T05:30:00'
  },
  {
    id: 'not-3',
    userId: '4',
    title: 'Route Optimization Complete',
    message: 'Route B has been optimized and updated',
    type: 'success',
    read: true,
    createdAt: '2025-01-08T16:20:00'
  }
];