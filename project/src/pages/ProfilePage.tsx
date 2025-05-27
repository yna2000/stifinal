import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, QrCode, Eye, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import QRCode from 'react-qr-code';
import { mockApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface JoinedEvent {
  id: string;
  title: string;
  date: Date;
  location: string;
  qrCode: string;
  joinedAt: Date;
}

const ProfilePage = () => {
  const [joinedEvents, setJoinedEvents] = useState<JoinedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQR, setSelectedQR] = useState<string | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        if (!user) return;
        
        const { events } = await mockApi.getUserEvents(user.id);
        setJoinedEvents(events);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch user events:', err);
        setIsLoading(false);
      }
    };
    
    fetchUserEvents();
  }, [user]);
  
  const handleShowQR = (qrCode: string) => {
    setSelectedQR(qrCode);
    setShowQRModal(true);
  };
  
  const closeQRModal = () => {
    setShowQRModal(false);
    setSelectedQR(null);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse-slow flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">My Profile</h1>
        <p className="text-gray-600">View your events and QR codes</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-3xl font-bold">
                {user?.name?.charAt(0)}
              </div>
              
              <h2 className="text-xl font-semibold mt-4">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
              
              <div className="mt-4 py-2 px-4 bg-primary-50 rounded-lg text-primary-700 font-medium text-sm inline-flex items-center">
                <BookOpen size={16} className="mr-2" />
                {user?.studentId || 'Student'}
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3">Account Information</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Email</span>
                  <span className="text-gray-900">{user?.email}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Role</span>
                  <span className="text-gray-900 capitalize">{user?.role}</span>
                </div>
                
                {user?.studentId && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Student ID</span>
                    <span className="text-gray-900">{user?.studentId}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold">My Events</h2>
              <p className="text-gray-600 text-sm mt-1">Events you've joined</p>
            </div>
            
            <div className="divide-y divide-gray-100">
              {joinedEvents.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Calendar size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No events joined yet</h3>
                  <p className="text-gray-600 mb-4">Browse and join events to see them here.</p>
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="btn-primary mx-auto"
                  >
                    Browse Events
                  </button>
                </div>
              ) : (
                joinedEvents.map(event => (
                  <div key={event.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{event.title}</h3>
                        
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar size={14} className="mr-1" />
                            <span>{format(new Date(event.date), 'MMMM d, yyyy')}</span>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock size={14} className="mr-1" />
                            <span>{format(new Date(event.date), 'h:mm a')}</span>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin size={14} className="mr-1" />
                            <span>{event.location}</span>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <Eye size={14} className="mr-1" />
                            <span>Joined {format(new Date(event.joinedAt), 'MMM d, yyyy')}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleShowQR(event.qrCode)}
                          className="inline-flex items-center p-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          title="Show QR Code"
                        >
                          <QrCode size={18} />
                        </button>
                        
                        <button 
                          onClick={() => navigate(`/events/${event.id}`)}
                          className="inline-flex items-center p-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          title="View Event"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* QR Code Modal */}
      {showQRModal && selectedQR && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={closeQRModal}
            ></div>
            
            <div className="bg-white rounded-xl shadow-xl transform transition-all w-full max-w-md relative z-10 p-6 animate-fade-in">
              <button 
                onClick={closeQRModal}
                className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <XIcon size={20} />
              </button>
              
              <h3 className="text-lg font-semibold text-center mb-4">Your Event QR Code</h3>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mx-auto max-w-xs">
                <QRCode value={selectedQR} size={200} />
              </div>
              <p className="text-sm text-gray-600 text-center mt-4">
                Show this QR code to the event organizer for check-in.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// BookOpen icon component
const BookOpen = ({ size, className }: { size: number, className?: string }) => (
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
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);

// X icon component
const XIcon = ({ size, className }: { size: number, className?: string }) => (
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
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default ProfilePage;