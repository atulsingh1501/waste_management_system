import React, { useState } from 'react';
import { 
  CheckSquare, 
  Clock, 
  MapPin, 
  Navigation,
  User,
  Truck,
  Calendar,
  Filter,
  Search,
  Play,
  Pause,
  CheckCircle
} from 'lucide-react';
import { useSupabaseQuery, useSupabaseMutation } from '../../hooks/useSupabase';
import { useAuth } from '../../context/AuthContext';

export default function TaskManagement() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: collections, loading, error } = useSupabaseQuery('collections', {
    eq: user?.role === 'staff' ? ['assigned_staff', user.id] : undefined,
    order: ['scheduled_time', { ascending: true }]
  });

  const { data: vehicles } = useSupabaseQuery('vehicles');
  const { data: routes } = useSupabaseQuery('routes');
  const { data: profiles } = useSupabaseQuery('profiles');

  const { update: updateCollection, loading: updating } = useSupabaseMutation('collections');

  const filteredTasks = collections?.filter(task => {
    const matchesSearch = task.area.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const todaysTasks = filteredTasks.filter(task => 
    new Date(task.scheduled_time).toDateString() === new Date().toDateString()
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-orange-600 bg-orange-100';
      case 'missed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const updateData: any = { status: newStatus };
      
      if (newStatus === 'in-progress') {
        updateData.actual_start_time = new Date().toISOString();
      } else if (newStatus === 'completed') {
        updateData.actual_end_time = new Date().toISOString();
      }
      
      await updateCollection(taskId, updateData);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const getVehiclePlate = (vehicleId: string | null) => {
    if (!vehicleId) return 'No vehicle';
    const vehicle = vehicles?.find(v => v.id === vehicleId);
    return vehicle?.plate_number || 'Unknown';
  };

  const getRouteName = (routeId: string | null) => {
    if (!routeId) return 'No route';
    const route = routes?.find(r => r.id === routeId);
    return route?.name || 'Unknown';
  };

  const getStaffName = (staffId: string | null) => {
    if (!staffId) return 'Unassigned';
    const staff = profiles?.find(p => p.id === staffId);
    return staff?.name || 'Unknown';
  };

  const stats = {
    totalTasks: todaysTasks.length,
    completedTasks: todaysTasks.filter(t => t.status === 'completed').length,
    inProgressTasks: todaysTasks.filter(t => t.status === 'in-progress').length,
    pendingTasks: todaysTasks.filter(t => t.status === 'pending').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading tasks: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {user?.role === 'staff' ? 'My Tasks' : 'Task Management'}
          </h2>
          <p className="text-gray-600">
            {user?.role === 'staff' 
              ? 'Your assigned collection tasks and schedules'
              : 'Manage and assign collection tasks to staff'
            }
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Tasks</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalTasks}</p>
            </div>
            <CheckSquare className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-green-600">{stats.completedTasks}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-3xl font-bold text-blue-600">{stats.inProgressTasks}</p>
            </div>
            <Play className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-orange-600">{stats.pendingTasks}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks by area..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="missed">Missed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Tasks ({filteredTasks.length})
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredTasks.map((task) => (
            <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-4">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <MapPin className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-medium text-gray-900">{task.area}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>
                          {new Date(task.scheduled_time).toLocaleDateString()} at{' '}
                          {new Date(task.scheduled_time).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Truck className="h-4 w-4 mr-2" />
                        <span>{getVehiclePlate(task.vehicle_id)}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        <span>{getStaffName(task.assigned_staff)}</span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      Route: {getRouteName(task.route_id)} • Type: {task.waste_type}
                    </div>
                    {task.notes && (
                      <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        <strong>Notes:</strong> {task.notes}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {task.status === 'pending' && (
                    <button
                      onClick={() => handleStatusChange(task.id, 'in-progress')}
                      disabled={updating}
                      className="flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Start
                    </button>
                  )}
                  {task.status === 'in-progress' && (
                    <button
                      onClick={() => handleStatusChange(task.id, 'completed')}
                      disabled={updating}
                      className="flex items-center px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Complete
                    </button>
                  )}
                  <button className="flex items-center px-3 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors">
                    <Navigation className="h-4 w-4 mr-1" />
                    Navigate
                  </button>
                </div>
              </div>
              
              {/* Progress Timeline */}
              {(task.actual_start_time || task.actual_end_time) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    {task.actual_start_time && (
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        Started: {new Date(task.actual_start_time).toLocaleString()}
                      </div>
                    )}
                    {task.actual_end_time && (
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Completed: {new Date(task.actual_end_time).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}