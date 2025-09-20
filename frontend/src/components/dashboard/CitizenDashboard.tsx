import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MapPin,
  FileText,
  TrendingUp,
  Calendar,
  Phone
} from 'lucide-react';
import { mockReports } from '../../data/mockData';

export default function CitizenDashboard() {
  const userReports = mockReports.filter(report => report.citizenId === '3');
  
  const stats = {
    totalReports: userReports.length,
    resolved: userReports.filter(r => r.status === 'resolved').length,
    inProgress: userReports.filter(r => r.status === 'in-progress').length,
    pending: userReports.filter(r => r.status === 'received').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'received': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const collectionSchedule = [
    { day: 'Monday', type: 'General Waste', time: '08:00 AM', area: 'Your Area' },
    { day: 'Wednesday', type: 'Recyclables', time: '10:00 AM', area: 'Your Area' },
    { day: 'Friday', type: 'Compost', time: '09:00 AM', area: 'Your Area' }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-blue-600 p-6 rounded-lg text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome to Waste Management Portal</h2>
        <p className="text-emerald-100">
          Report issues, track your submissions, and stay informed about collection schedules.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Reports</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalReports}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Reports */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">My Recent Reports</h3>
            <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="p-6">
            {userReports.length > 0 ? (
              <div className="space-y-4">
                {userReports.map((report) => (
                  <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status.replace('-', ' ').toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(report.priority)}`}>
                          {report.priority.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(report.reportedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">{report.location}</p>
                        <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No reports submitted yet.</p>
                <button className="mt-2 text-emerald-600 hover:text-emerald-700 font-medium">
                  Submit your first report
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Collection Schedule & Quick Actions */}
        <div className="space-y-6">
          {/* Collection Schedule */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Collection Schedule</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {collectionSchedule.map((schedule, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">{schedule.day}</p>
                        <p className="text-sm text-gray-600">{schedule.type}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-emerald-600">{schedule.time}</span>
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
                <AlertTriangle className="h-5 w-5 mr-2" />
                Report New Issue
              </button>
              <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <MapPin className="h-5 w-5 mr-2" />
                Find Collection Points
              </button>
              <button className="w-full flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                <Phone className="h-5 w-5 mr-2" />
                Contact Support
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Emergency Contact</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Hotline:</span>
                  <span className="font-medium text-emerald-600">311</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">support@waste.city</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hours:</span>
                  <span className="font-medium">24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}