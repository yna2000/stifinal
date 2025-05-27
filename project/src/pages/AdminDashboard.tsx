import React, { useState, useEffect } from 'react';
import { mockApi } from '../services/api';
import { Plus, Calendar, Users, TrendingUp, Bell } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import StatCard from '../components/admin/StatCard';
import EventForm from '../components/admin/EventForm';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [showEventForm, setShowEventForm] = useState(false);
  
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch events
        const { events } = await mockApi.getEvents();
        setEvents(events);
        setIsLoading(false);
        
        // Fetch stats
        const { stats } = await mockApi.getAdminStats();
        setStats(stats);
        setIsStatsLoading(false);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setIsLoading(false);
        setIsStatsLoading(false);
      }
    };
    
    fetchDashboardData();
    
    // Welcome notification for admin
    const hasVisited = localStorage.getItem('hasVisitedAdminDashboard');
    if (!hasVisited && user?.role === 'admin') {
      setTimeout(() => {
        addNotification({
          type: 'admin_alert',
          title: 'Welcome to Admin Dashboard',
          message: 'Manage events, track attendance, and monitor analytics.'
        });
        localStorage.setItem('hasVisitedAdminDashboard', 'true');
      }, 1000);
    }
  }, [addNotification, user]);
  
  const handleCreateEvent = async (eventData: any) => {
    try {
      const { success, event } = await mockApi.createEvent(eventData);
      
      if (success) {
        setEvents([event, ...events]);
        setShowEventForm(false);
        toast.success('Event created successfully!');
        
        // Update stats
        if (stats) {
          setStats({
            ...stats,
            totalEvents: stats.totalEvents + 1,
            upcomingEvents: stats.upcomingEvents + 1
          });
        }
      }
    } catch (error) {
      console.error('Failed to create event:', error);
      toast.error('Failed to create event. Please try again.');
      throw error;
    }
  };
  
  if (isLoading && isStatsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse-slow flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage events and monitor activity</p>
        </div>
        
        <button 
          onClick={() => setShowEventForm(true)}
          className="btn-primary mt-4 md:mt-0"
        >
          <Plus size={18} className="mr-2" />
          Create Event
        </button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Students" 
          value={stats?.totalStudents || 0} 
          icon={<Users size={20} className="text-primary-500" />}
          color="bg-primary-50"
          change={{ value: 12, isPositive: true }}
        />
        
        <StatCard 
          title="Total Events" 
          value={stats?.totalEvents || 0} 
          icon={<Calendar size={20} className="text-accent-500" />}
          color="bg-accent-50"
          change={{ value: 8, isPositive: true }}
        />
        
        <StatCard 
          title="Upcoming Events" 
          value={stats?.upcomingEvents || 0} 
          icon={<Clock size={20} className="text-warning-500" />}
          color="bg-warning-50"
        />
        
        <StatCard 
          title="Total Attendance" 
          value={stats?.totalAttendance || 0} 
          icon={<TrendingUp size={20} className="text-success-500" />}
          color="bg-success-50"
          change={{ value: 15, isPositive: true }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold">Upcoming Events</h2>
              <span className="badge-primary">{events.length} Events</span>
            </div>
            
            <div className="divide-y divide-gray-100">
              {events.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Calendar size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No events created yet</h3>
                  <p className="text-gray-600 mb-4">Create your first event to get started.</p>
                  <button 
                    onClick={() => setShowEventForm(true)}
                    className="btn-primary mx-auto"
                  >
                    <Plus size={18} className="mr-2" />
                    Create Event
                  </button>
                </div>
              ) : (
                events.slice(0, 5).map(event => (
                  <div key={event.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                        <img 
                          src={event.image} 
                          alt={event.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-medium text-gray-900 truncate">{event.title}</h3>
                        
                        <div className="mt-1 flex items-center">
                          <Calendar size={14} className="text-gray-500 mr-1" />
                          <span className="text-sm text-gray-600">
                            {format(new Date(event.date), 'MMM d, yyyy')}
                          </span>
                        </div>
                        
                        <div className="mt-1 flex items-center">
                          <Users size={14} className="text-gray-500 mr-1" />
                          <span className="text-sm text-gray-600">
                            {event.registered} / {event.capacity} registered
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0">
                        <a 
                          href={`/admin/events/${event.id}`}
                          className="btn-secondary py-1 px-3 text-sm"
                        >
                          View
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {events.length > 5 && (
              <div className="p-4 border-t border-gray-100 text-center">
                <a 
                  href="/admin/events"
                  className="text-sm font-medium text-primary-600 hover:text-primary-500"
                >
                  View all events
                </a>
              </div>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold">Recent Activity</h2>
              <div className="p-1 rounded-full bg-primary-50">
                <Bell size={18} className="text-primary-500" />
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {stats?.recentJoins?.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No recent activity to display
                </div>
              ) : (
                stats?.recentJoins?.map((activity: any, index: number) => (
                  <div key={index} className="p-4">
                    <div className="flex items-start">
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
                        {activity.studentName.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{activity.studentName}</span>
                          {' joined '}
                          <span className="font-medium">{activity.eventTitle}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(activity.time), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Event Form Modal */}
      {showEventForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => setShowEventForm(false)}
            ></div>
            
            <div className="bg-white rounded-xl shadow-xl transform transition-all w-full max-w-lg relative z-10 p-6 animate-fade-in">
              <h2 className="text-xl font-bold mb-6">Create New Event</h2>
              <EventForm
                onSubmit={handleCreateEvent}
                onCancel={() => setShowEventForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Clock icon component
const Clock = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

export default AdminDashboard;