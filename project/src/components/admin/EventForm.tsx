import React, { useState } from 'react';
import { Calendar, MapPin, Users, X, Image } from 'lucide-react';

interface EventFormProps {
  onSubmit: (eventData: any) => Promise<void>;
  onCancel: () => void;
  initialData?: any;
}

const EventForm: React.FC<EventFormProps> = ({
  onSubmit,
  onCancel,
  initialData
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : '',
    time: initialData?.date ? new Date(initialData.date).toTimeString().slice(0, 5) : '',
    location: initialData?.location || '',
    capacity: initialData?.capacity || '',
    image: initialData?.image || '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.time) {
      newErrors.time = 'Time is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.capacity) {
      newErrors.capacity = 'Capacity is required';
    } else if (isNaN(Number(formData.capacity)) || Number(formData.capacity) <= 0) {
      newErrors.capacity = 'Capacity must be a positive number';
    }
    
    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required';
    } else if (!isValidURL(formData.image)) {
      newErrors.image = 'Please enter a valid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const isValidURL = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Combine date and time
      const eventDateTime = new Date(`${formData.date}T${formData.time}`);
      
      const eventData = {
        title: formData.title,
        description: formData.description,
        date: eventDateTime,
        location: formData.location,
        capacity: Number(formData.capacity),
        image: formData.image,
      };
      
      await onSubmit(eventData);
    } catch (error) {
      console.error('Error submitting event:', error);
      setErrors({ submit: 'Failed to save event. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.submit && (
        <div className="bg-error-50 text-error-700 p-3 rounded-lg">
          {errors.submit}
        </div>
      )}
      
      <div>
        <label htmlFor="title" className="form-label">
          Event Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`form-input ${errors.title ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
          placeholder="Tech Workshop"
        />
        {errors.title && <p className="form-error">{errors.title}</p>}
      </div>
      
      <div>
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className={`form-input ${errors.description ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
          placeholder="Provide details about the event..."
        ></textarea>
        {errors.description && <p className="form-error">{errors.description}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className="form-label">
            <Calendar size={16} className="inline mr-1" /> Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`form-input ${errors.date ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
          />
          {errors.date && <p className="form-error">{errors.date}</p>}
        </div>
        
        <div>
          <label htmlFor="time" className="form-label">
            <Clock size={16} className="inline mr-1" /> Time
          </label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className={`form-input ${errors.time ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
          />
          {errors.time && <p className="form-error">{errors.time}</p>}
        </div>
      </div>
      
      <div>
        <label htmlFor="location" className="form-label">
          <MapPin size={16} className="inline mr-1" /> Location
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className={`form-input ${errors.location ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
          placeholder="STI Main Campus - Room 301"
        />
        {errors.location && <p className="form-error">{errors.location}</p>}
      </div>
      
      <div>
        <label htmlFor="capacity" className="form-label">
          <Users size={16} className="inline mr-1" /> Capacity
        </label>
        <input
          type="number"
          id="capacity"
          name="capacity"
          value={formData.capacity}
          onChange={handleChange}
          className={`form-input ${errors.capacity ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
          placeholder="50"
          min="1"
        />
        {errors.capacity && <p className="form-error">{errors.capacity}</p>}
      </div>
      
      <div>
        <label htmlFor="image" className="form-label">
          <Image size={16} className="inline mr-1" /> Image URL
        </label>
        <input
          type="text"
          id="image"
          name="image"
          value={formData.image}
          onChange={handleChange}
          className={`form-input ${errors.image ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
          placeholder="https://example.com/image.jpg"
        />
        {errors.image && <p className="form-error">{errors.image}</p>}
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary flex items-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              Saving...
            </>
          ) : (
            'Save Event'
          )}
        </button>
      </div>
    </form>
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

export default EventForm;