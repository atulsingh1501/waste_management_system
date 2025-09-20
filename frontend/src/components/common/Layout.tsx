import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  LogOut, 
  Bell, 
  Settings, 
  Truck, 
  Map, 
  BarChart3, 
  Users, 
  AlertTriangle,
  Home,
  Route,
  FileText
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export default function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  const { user, logout } = useAuth();

  const getNavigationItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
    ];

    switch (user?.role) {
      case 'admin':
        return [
          ...baseItems,
          { id: 'users', label: 'Users', icon: Users },
          { id: 'routes', label: 'Routes', icon: Route },
          { id: 'vehicles', label: 'Vehicles', icon: Truck },
          { id: 'reports', label: 'Reports', icon: FileText },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        ];
      case 'manager':
        return [
          ...baseItems,
          { id: 'routes', label: 'Routes', icon: Route },
          { id: 'vehicles', label: 'Vehicles', icon: Truck },
          { id: 'reports', label: 'Reports', icon: FileText },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        ];
      case 'staff':
        return [
          ...baseItems,
          { id: 'tasks', label: 'My Tasks', icon: Map },
          { id: 'reports', label: 'Reports', icon: FileText },
        ];
      case 'citizen':
        return [
          ...baseItems,
          { id: 'report', label: 'Report Issue', icon: AlertTriangle },
          { id: 'my-reports', label: 'My Reports', icon: FileText },
        ];
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-6 py-6 border-b border-gray-200">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-emerald-600" />
              <span className="ml-3 text-xl font-bold text-gray-900">WasteMS</span>
            </div>
          </div>

          {/* User Info */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <span className="text-emerald-600 font-medium">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === item.id
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="px-4 py-4 border-t border-gray-200 space-y-2">
            <button className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100">
              <Settings className="h-5 w-5 mr-3" />
              Settings
            </button>
            <button
              onClick={logout}
              className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900 capitalize">
              {currentPage === 'my-reports' ? 'My Reports' : currentPage}
            </h1>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-500 transition-colors">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}