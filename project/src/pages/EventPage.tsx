import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, ArrowLeft, User } from 'lucide-react';
import { format } from 'date-fns';
import { mockApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import JoinEventModal from '../components/events/JoinEventModal';

const EventPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [userEvents, setUserEvents] = useState<any[]>([]);
  const [hasJoined, setHasJoined] = useState(false);
  
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        if (!eventId) return;
        
        // Fetch event details
        const { event } = await mockApi.getEvent(eventId);
        setEvent(event);
        
        // Fetch user's joined events to check if already joined
        if (user) {
          const { events } = await mockApi.getUserEvents(user.id);
          setUserEvents(events);
          setHasJoined(events.some((e: any) => e.id === eventId));
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch event data:', err);
        setError('Failed to load event details. Please try again later.');
        setIsLoading(false);
      }
    };
    
    fetchEventData();
  }, [eventId, user]);
  
  const handleJoinEvent = async () => {
    if (!user || !eventId) return '';
    
    try {
      const response = await mockApi.joinEvent(eventId, user.id);
      
      setHasJoined(true);
      
      // Add a notification about joining
      addNotification({
        type: 'event_reminder',
        title: `Joined: ${event.title}`,
        message: `You have successfully joined ${event.title}. Don't forget to check in on ${format(new Date(event.date), 'MMMM d, yyyy')}!`,
        eventId
      });
      
      return response.qrCode;
    } catch (error) {
      console.error('Failed to join event:', error);
      throw error;
    }
  };
  
  const goBack = () => {
    navigate(-1);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse-slow flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !event) {
    return (
      <div className="text-center py-12">
        <div className="bg-error-50 text-error-700 p-4 rounded-lg inline-block">
          <p>{error || 'Event not found'}</p>
          <button 
            onClick={goBack} 
            className="mt-2 text-sm font-medium text-primary-600 hover:text-primary-500 flex items-center justify-center mx-auto"
          >
            <ArrowLeft size={16} className="mr-1" />
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  const eventDate = new Date(event.date);
  const isEventFull = event.registered >= event.capacity;
  
  return (
    <div>
      <button 
        onClick={goBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={18} className="mr-1" />
        Back to events
      </button>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mb-8">
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="p-6 text-white">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{event.title}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  <span>{format(eventDate, 'MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  <span>{format(eventDate, 'h:mm a')}</span>
                </div>
                <div className="flex items-center">
                  <MapPin size={16} className="mr-1" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div>
              <div className="flex items-center mb-2">
                <Users size={18} className="text-gray-500 mr-2" />
                <span className="text-gray-700">
                  {event.registered} / {event.capacity} registered
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs">
                <div 
                  className={`h-2 rounded-full ${isEventFull ? 'bg-error-500' : 'bg-primary-500'}`}
                  style={{ width: `${Math.min(100, (event.registered / event.capacity) * 100)}%` }}
                ></div>
              </div>
            </div>
            
            {hasJoined ? (
              <div className="flex items-center bg-success-50 text-success-700 px-4 py-2 rounded-lg">
                <Check size={18} className="mr-2" />
                You've joined this event
              </div>
            ) : (
              <button 
                onClick={() => setJoinModalOpen(true)}
                className="btn-primary"
                disabled={isEventFull}
              >
                {isEventFull ? 'Event Full' : 'Join Event'}
              </button>
            )}
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">About This Event</h2>
            <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Event Details</h2>
            <div className="space-y-3">
              <div className="flex items-start">
                <User size={18} className="text-gray-500 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900">Organizer</h3>
                  <p className="text-gray-700">{event.organizer || 'STI Events Committee'}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar size={18} className="text-gray-500 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900">Date and Time</h3>
                  <p className="text-gray-700">{format(eventDate, 'EEEE, MMMM d, yyyy')} at {format(eventDate, 'h:mm a')}</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin size={18} className="text-gray-500 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900">Location</h3>
                  <p className="text-gray-700">{event.location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <JoinEventModal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        eventId={eventId || ''}
        eventTitle={event.title}
        onJoin={handleJoinEvent}
      />
    </div>
  );
};

// Check icon component
const Check = ({ size, className }: { size: number, className?: string }) => (
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
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default EventPage;