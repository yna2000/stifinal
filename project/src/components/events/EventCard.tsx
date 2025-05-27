import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  capacity: number;
  registered: number;
  image: string;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  description,
  date,
  location,
  capacity,
  registered,
  image
}) => {
  // Calculate registration percentage
  const registrationPercentage = (registered / capacity) * 100;
  
  // Determine badge color based on capacity
  const getBadgeColor = () => {
    if (registrationPercentage >= 90) return 'badge-error';
    if (registrationPercentage >= 70) return 'badge-warning';
    return 'badge-success';
  };
  
  // Truncate description
  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  return (
    <div className="card group">
      <div className="relative h-40 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <span className={`${getBadgeColor()}`}>
            {registered} / {capacity} registered
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-600 text-sm mb-3">{truncateDescription(description)}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar size={16} className="mr-2 flex-shrink-0" />
            <span>{format(new Date(date), 'EEEE, MMMM d, yyyy')}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <MapPin size={16} className="mr-2 flex-shrink-0" />
            <span>{location}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <Users size={16} className="mr-2 flex-shrink-0" />
            <span>{registered} attending</span>
          </div>
        </div>
        
        <Link 
          to={`/events/${id}`}
          className="btn-primary w-full"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;