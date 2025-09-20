import React from 'react';
import { 
  Users, 
  Truck, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Map,
  BarChart3
} from 'lucide-react';
import { mockCollections, mockVehicles, mockReports, mockBins } from '../../data/mockData';

export default function AdminDashboard() {
  const stats = {
    totalUsers: 156,
    activeVehicles: mockVehicles.filter(v => v.status === 'active').length,
    pendingReports: mockReports.filter(r => r.status === 'received').length,
    completedCollections: mockCollections.filter(c => c.status === 'completed').length,
    totalBins: mockBins.length,
    overflowingBins: mockBins.filter(b => b.status === 'overflowing').length
  };

  const recentActivity = [
    { id: 1, action: 'New citizen report', location: 'Downtown', time: '2 minutes ago', type: 'report' },
    { id: 2, action: 'Route completed', location: 'Industrial Zone', time: '15 minutes ago', type: 'collection' },
    { id: 3, action: 'Vehicle maintenance', location: 'Depot', time: '1 hour ago', type: 'maintenance' },
    { id: 4, action: 'User registered', location: 'System', time: '2 hours ago', type: 'user' }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>12% increase</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Vehicles</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeVehicles}</p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-full">
              <Truck className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <span>{mockVehicles.filter(v => v.status === 'maintenance').length} in maintenance</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Reports</p>
              <p className="text-3xl font-bold text-gray-900">{stats.pendingReports}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-orange-600">
            <Clock className="h-4 w-4 mr-1" />
            <span>Avg 2.5h response</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Collections</p>
              <p className="text-3xl font-bold text-gray-900">{stats.completedCollections}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <span>87% completion rate</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'report' ? 'bg-orange-100' :
                    activity.type === 'collection' ? 'bg-green-100' :
                    activity.type === 'maintenance' ? 'bg-red-100' :
                    'bg-blue-100'
                  }`}>
                    {activity.type === 'report' && <AlertTriangle className="h-4 w-4 text-orange-600" />}
                    {activity.type === 'collection' && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {activity.type === 'maintenance' && <Truck className="h-4 w-4 text-red-600" />}
                    {activity.type === 'user' && <Users className="h-4 w-4 text-blue-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.location}</p>
                  </div>
                  <div className="text-sm text-gray-400">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6 space-y-4">
            <button className="w-full flex items-center justify-center px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              <Map className="h-5 w-5 mr-2" />
              View Live Map
            </button>
            <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <BarChart3 className="h-5 w-5 mr-2" />
              Generate Report
            </button>
            <button className="w-full flex items-center justify-center px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Alert Priority Issues
            </button>
            <button className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <Truck className="h-5 w-5 mr-2" />
              Optimize Routes
            </button>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">System Health</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">99.9%</div>
              <div className="text-sm text-gray-600">System Uptime</div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '99.9%' }}></div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">2.1s</div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">156</div>
              <div className="text-sm text-gray-600">Active Users</div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}