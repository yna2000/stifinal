import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Bell, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Calendar, 
  Home, 
  BarChart,
  PieChart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import NotificationPanel from '../shared/NotificationPanel';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const location = useLocation();
  
  const isAdmin = user?.role === 'admin';
  
  const navLinks = isAdmin 
    ? [
        { name: 'Dashboard', path: '/admin', icon: <Home size={20} /> },
        { name: 'Analytics', path: '/admin/analytics', icon: <PieChart size={20} /> },
        { name: 'Events', path: '/admin/events', icon: <Calendar size={20} /> },
      ]
    : [
        { name: 'Dashboard', path: '/dashboard', icon: <Home size={20} /> },
        { name: 'Profile', path: '/profile', icon: <User size={20} /> },
      ];
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleNotifications = () => {
    setNotificationPanelOpen(!notificationPanelOpen);
    if (sidebarOpen) setSidebarOpen(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 md:hidden"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link to={isAdmin ? '/admin' : '/dashboard'} className="flex items-center ml-2 md:ml-0">
              <span className="text-xl font-bold text-primary-600">Logged<span className="text-accent-500">In</span></span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={toggleNotifications}
              className="p-2 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 relative"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-accent-500 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
            
            <div className="relative group">
              <button 
                className="flex items-center space-x-1 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="User menu"
              >
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
                  {user?.name?.charAt(0)}
                </div>
                <span className="text-sm text-gray-700 hidden md:block">{user?.name}</span>
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                <Link 
                  to={isAdmin ? '/admin/profile' : '/profile'}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <User size={16} className="mr-2" /> Profile
                </Link>
                <button 
                  onClick={logout}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-error-600 hover:bg-gray-100"
                >
                  <LogOut size={16} className="mr-2" /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar for mobile */}
      <div 
        className={`fixed inset-0 bg-gray-600 bg-opacity-75 z-20 transition-opacity duration-300 md:hidden ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      ></div>
      
      <div 
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-30 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-auto md:shadow-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center py-6 border-b border-gray-200 md:hidden">
            <span className="text-xl font-bold text-primary-600">Logged<span className="text-accent-500">In</span></span>
          </div>
          
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
                  location.pathname === link.path
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="mr-3">{link.icon}</span>
                {link.name}
              </Link>
            ))}
          </nav>
          
          <div className="p-4 border-t border-gray-200 md:hidden">
            <button 
              onClick={logout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-error-600 hover:bg-gray-50 rounded-lg"
            >
              <LogOut size={18} className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Notification panel */}
      <NotificationPanel 
        isOpen={notificationPanelOpen} 
        onClose={() => setNotificationPanelOpen(false)} 
      />

      {/* Main content */}
      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;