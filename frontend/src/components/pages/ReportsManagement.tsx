import React, { useState } from 'react';
import { 
  FileText, 
  Search,
  Filter,
  MapPin,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  Eye,
  MessageSquare,
  Calendar
} from 'lucide-react';
import { useSupabaseQuery, useSupabaseMutation } from '../../hooks/useSupabase';

export default function ReportsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const { data: reports, loading, error } = useSupabaseQuery('citizen_reports', {
    order: ['created_at', { ascending: false }]
  });

  const { data: profiles } = useSupabaseQuery('profiles');

  const { update: updateReport, loading: updating } = useSupabaseMutation('citizen_reports');

  const filteredReports = reports?.filter(report => {
    const matchesSearch = report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || report.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  }) || [];

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

  const handleStatusChange = async (reportId: string, newStatus: string) => {
    try {
      const updateData: any = { status: newStatus };
      if (newStatus === 'resolved') {
        updateData.resolved_at = new Date().toISOString();
      }
      await updateReport(reportId, updateData);
    } catch (error) {
      console.error('Error updating report status:', error);
    }
  };

  const getCitizenName = (citizenId: string) => {
    const citizen = profiles?.find(p => p.id === citizenId);
    return citizen?.name || 'Unknown Citizen';
  };

  const getAssignedStaffName = (staffId: string | null) => {
    if (!staffId) return 'Unassigned';
    const staff = profiles?.find(p => p.id === staffId);
    return staff?.name || 'Unknown Staff';
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
        <p className="text-red-800">Error loading reports: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports Management</h2>
          <p className="text-gray-600">Manage citizen reports and track resolutions</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-3xl font-bold text-gray-900">{reports?.length || 0}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-orange-600">
                {reports?.filter(r => r.status === 'received').length || 0}
              </p>
            </div>
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-3xl font-bold text-blue-600">
                {reports?.filter(r => r.status === 'in-progress').length || 0}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-3xl font-bold text-green-600">
                {reports?.filter(r => r.status === 'resolved').length || 0}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
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
                placeholder="Search reports by location or description..."
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
                <option value="received">Received</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Reports ({filteredReports.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Citizen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.map((report) => (
                <tr 
                  key={report.id} 
                  className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedReport === report.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedReport(selectedReport === report.id ? null : report.id)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{report.location}</div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">{report.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{getCitizenName(report.citizen_id)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={report.status}
                      onChange={(e) => handleStatusChange(report.id, e.target.value)}
                      disabled={updating}
                      onClick={(e) => e.stopPropagation()}
                      className={`px-3 py-1 rounded-full text-xs font-medium border-0 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${getStatusColor(report.status)}`}
                    >
                      <option value="received">Received</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(report.priority)}`}>
                      {report.priority.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getAssignedStaffName(report.assigned_to)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(report.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 text-green-600 hover:bg-green-100 rounded"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Details */}
      {selectedReport && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Report Details</h3>
          </div>
          <div className="p-6">
            {(() => {
              const report = reports?.find(r => r.id === selectedReport);
              if (!report) return null;
              
              return (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Location & Description</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-start space-x-3 mb-3">
                          <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                          <div>
                            <p className="font-medium text-gray-900">{report.location}</p>
                            <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Report Information</h4>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Waste Type:</span>
                          <span className="font-medium capitalize">{report.waste_type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Priority:</span>
                          <span className={`font-medium capitalize ${getPriorityColor(report.priority).split(' ')[0]}`}>
                            {report.priority}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`font-medium capitalize ${getStatusColor(report.status).split(' ')[0]}`}>
                            {report.status.replace('-', ' ')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Reported:</span>
                          <span className="font-medium">{new Date(report.created_at).toLocaleString()}</span>
                        </div>
                        {report.resolved_at && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Resolved:</span>
                            <span className="font-medium">{new Date(report.resolved_at).toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Assignment</h4>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Citizen:</span>
                          <span className="font-medium">{getCitizenName(report.citizen_id)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Assigned To:</span>
                          <span className="font-medium">{getAssignedStaffName(report.assigned_to)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {report.resolution_notes && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Resolution Notes</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600">{report.resolution_notes}</p>
                        </div>
                      </div>
                    )}
                    
                    {report.image_url && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Attached Image</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <img 
                            src={report.image_url} 
                            alt="Report" 
                            className="max-w-full h-auto rounded-lg"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}