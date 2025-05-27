import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import QRCode from 'react-qr-code';

interface JoinEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
  onJoin: () => Promise<string>;
}

const JoinEventModal: React.FC<JoinEventModalProps> = ({
  isOpen,
  onClose,
  eventId,
  eventTitle,
  onJoin
}) => {
  const [status, setStatus] = useState<'initial' | 'loading' | 'success'>('initial');
  const [qrCodeValue, setQrCodeValue] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  const handleJoin = async () => {
    setStatus('loading');
    setError('');
    
    try {
      const qrValue = await onJoin();
      setQrCodeValue(qrValue);
      setStatus('success');
    } catch (err) {
      setError('Failed to join event. Please try again.');
      setStatus('initial');
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        ></div>
        
        {/* Modal */}
        <div className="bg-white rounded-xl shadow-xl transform transition-all w-full max-w-md relative z-10 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Join Event</h3>
            <button 
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6">
            {status === 'initial' && (
              <>
                <p className="text-gray-600 mb-4">
                  You're about to join <span className="font-semibold">{eventTitle}</span>. 
                  Once you join, you'll receive a unique QR code for check-in.
                </p>
                
                {error && (
                  <div className="bg-error-50 text-error-700 p-3 rounded-lg mb-4">
                    {error}
                  </div>
                )}
                
                <div className="flex justify-end mt-4">
                  <button 
                    onClick={onClose}
                    className="btn-secondary mr-3"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleJoin}
                    className="btn-primary"
                  >
                    Join Event
                  </button>
                </div>
              </>
            )}
            
            {status === 'loading' && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Joining event...</p>
              </div>
            )}
            
            {status === 'success' && (
              <div className="flex flex-col items-center py-4">
                <div className="bg-success-100 text-success-700 rounded-full p-2 mb-4">
                  <Check size={24} />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Successfully Joined!</h4>
                <p className="text-gray-600 text-center mb-6">
                  You've joined {eventTitle}. Here's your QR code for check-in.
                </p>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
                  <QRCode value={qrCodeValue} size={200} />
                </div>
                
                <p className="text-sm text-gray-500 text-center mb-4">
                  Please show this QR code when you arrive at the event. You can also find it in your profile.
                </p>
                
                <button 
                  onClick={onClose}
                  className="btn-primary"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinEventModal;