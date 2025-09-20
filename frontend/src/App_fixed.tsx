import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext_backend';
import LoginForm from './components/auth/LoginForm_fixed';
import Layout from './components/common/Layout';
import AdminDashboard from './components/dashboard/AdminDashboard';
import StaffDashboard from './components/dashboard/StaffDashboard';
import CitizenDashboard from './components/dashboard/CitizenDashboard';
import CitizenReportForm from './components/pages/CitizenReportForm';
import RouteManagement from './components/pages/RouteManagement';
import UserManagement from './components/pages/UserManagement';
import VehicleManagement from './components/pages/VehicleManagement';
import ReportsManagement from './components/pages/ReportsManagement';
import Analytics from './components/pages/Analytics';
import TaskManagement from './components/pages/TaskManagement';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg font-medium text-gray-900">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        switch (user.role) {
          case 'admin':
          case 'manager':
            return <AdminDashboard />;
          case 'staff':
            return <StaffDashboard />;
          case 'citizen':
            return <CitizenDashboard />;
          default:
            return <AdminDashboard />;
        }
      case 'report':
        return <CitizenReportForm />;
      case 'routes':
        return <RouteManagement />;
      case 'tasks':
        return <TaskManagement />;
      case 'users':
        return <UserManagement />;
      case 'vehicles':
        return <VehicleManagement />;
      case 'reports':
        return <ReportsManagement />;
      case 'analytics':
        return <Analytics />;
      case 'my-reports':
        return <ReportsManagement />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
