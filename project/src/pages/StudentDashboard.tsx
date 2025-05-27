import React, { useState, useEffect } from 'react';
import { mockApi } from '../services/api';
import { Calendar, Users } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import EventCard from '../components/events/EventCard';

const StudentDashboard = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { events } = await mockApi.getEvents();
        setEvents(events);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setError('Failed to load events. Please try again later.');
        setIsLoading(false);
      }
    };
    
    fetchEvents();
    
    // Welcome notification for first-time visit (using localStorage to track)
    const hasVisited = localStorage.getItem('hasVisitedDashboard');
    if (!hasVisited && user) {
      addNotification({
        type: 'system',
        title: 'Welcome to your dashboard!',
        message: `Hello ${user.name}! Browse and join events to get started.`
      });
      localStorage.setItem('hasVisitedDashboard', 'true');
    }
  }, [addNotification, user]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse-slow flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-error-50 text-error-700 p-4 rounded-lg inline-block">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  // Group events by month
  const upcomingEvents = events.filter(event => new Date(event.date) >= new Date());
  
  // Get today's date without time
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Events happening today
  const todayEvents = upcomingEvents.filter(event => {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate.getTime() === today.getTime();
  });
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome, {user?.name}!</h1>
        <p className="text-gray-600">Discover and join upcoming events.</p>
      </div>
      
      {todayEvents.length > 0 && (
        <div className="mb-8">
          <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 mb-4">
            <div className="flex items-start">
              <div className="bg-primary-100 text-primary-700 p-2 rounded-lg mr-3">
                <Calendar size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-primary-900">Events happening today</h3>
                <p className="text-primary-700 text-sm mt-1">You have {todayEvents.length} event{todayEvents.length > 1 ? 's' : ''} scheduled for today.</p>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              {todayEvents.map(event => (
                <div key={event.id} className="bg-white p-3 rounded-lg border border-primary-200 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-600">{event.location}</p>
                  </div>
                  <a href={`/events/${event.id}`} className="btn-primary py-1 px-3 text-sm">
                    View
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
          <div className="flex items-center text-sm text-gray-600">
            <Users size={16} className="mr-1" />
            <span>{events.length} Events Available</span>
          </div>
        </div>
        
        {upcomingEvents.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Calendar size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No upcoming events</h3>
            <p className="text-gray-600">Check back later for new events.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map(event => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                description={event.description}
                date={new Date(event.date)}
                location={event.location}
                capacity={event.capacity}
                registered={event.registered}
                image={event.image}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;