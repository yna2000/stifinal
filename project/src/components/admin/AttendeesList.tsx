import React from 'react';
import { Search, Download, Users } from 'lucide-react';
import { format } from 'date-fns';

interface Attendee {
  id: string;
  name: string;
  studentId: string;
  joinedAt: Date;
  status: 'joined' | 'attended' | 'absent';
}

interface AttendeesListProps {
  eventId: string;
  eventTitle: string;
  attendees: Attendee[];
  isLoading: boolean;
}

const AttendeesList: React.FC<AttendeesListProps> = ({
  eventId,
  eventTitle,
  attendees,
  isLoading
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // Filter attendees based on search term
  const filteredAttendees = attendees.filter(attendee => 
    attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attendee.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Calculate statistics
  const totalJoined = attendees.length;
  const totalAttended = attendees.filter(a => a.status === 'attended').length;
  const totalAbsent = attendees.filter(a => a.status === 'absent').length;
  const attendanceRate = totalJoined > 0 ? Math.round((totalAttended / totalJoined) * 100) : 0;
  
  // Download attendees as CSV
  const downloadCSV = () => {
    const headers = ['Name', 'Student ID', 'Joined At', 'Status'];
    const rows = attendees.map(attendee => [
      attendee.name,
      attendee.studentId,
      format(new Date(attendee.joinedAt), 'yyyy-MM-dd HH:mm:ss'),
      attendee.status
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${eventTitle.replace(/\s+/g, '-').toLowerCase()}-attendees.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Attendees ({attendees.length})
          </h3>
          
          <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search attendees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full"
              />
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            
            <button
              onClick={downloadCSV}
              className="btn-secondary flex items-center text-sm py-1.5"
              disabled={attendees.length === 0}
            >
              <Download size={16} className="mr-1" />
              Export
            </button>
          </div>
        </div>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border-b border-gray-200">
        <div className="bg-primary-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-600 text-sm font-medium">Total Joined</p>
              <h4 className="text-2xl font-bold text-primary-700 mt-1">{totalJoined}</h4>
            </div>
            <div className="bg-primary-100 p-2 rounded-lg">
              <Users size={20} className="text-primary-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-success-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-success-600 text-sm font-medium">Attended</p>
              <h4 className="text-2xl font-bold text-success-700 mt-1">{totalAttended}</h4>
            </div>
            <div className="bg-success-100 p-2 rounded-lg">
              <CheckCircle size={20} className="text-success-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-error-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-error-600 text-sm font-medium">Absent</p>
              <h4 className="text-2xl font-bold text-error-700 mt-1">{totalAbsent}</h4>
            </div>
            <div className="bg-error-100 p-2 rounded-lg">
              <XCircle size={20} className="text-error-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-warning-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-warning-600 text-sm font-medium">Attendance Rate</p>
              <h4 className="text-2xl font-bold text-warning-700 mt-1">{attendanceRate}%</h4>
            </div>
            <div className="bg-warning-100 p-2 rounded-lg">
              <BarChart size={20} className="text-warning-600" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse-slow flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading attendees...</p>
            </div>
          </div>
        ) : attendees.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <Users size={24} className="text-gray-400" />
            </div>
            <p className="text-base">No attendees yet</p>
            <p className="text-sm text-gray-400 mt-1">Attendees will appear here once students join the event</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined At
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAttendees.map((attendee) => (
                <tr key={attendee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
                        {attendee.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{attendee.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{attendee.studentId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(attendee.joinedAt), 'MMM d, yyyy h:mm a')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      attendee.status === 'attended' 
                        ? 'bg-success-100 text-success-800'
                        : attendee.status === 'absent'
                        ? 'bg-error-100 text-error-800'
                        : 'bg-warning-100 text-warning-800'
                    }`}>
                      {attendee.status === 'attended' && <CheckCircle size={12} className="mr-1" />}
                      {attendee.status === 'absent' && <XCircle size={12} className="mr-1" />}
                      {attendee.status === 'joined' && <Clock size={12} className="mr-1" />}
                      {attendee.status.charAt(0).toUpperCase() + attendee.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// Icon components
const CheckCircle = ({ size, className }: { size: number, className?: string }) => (
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
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const XCircle = ({ size, className }: { size: number, className?: string }) => (
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
    <line x1="15" y1="9" x2="9" y2="15"></line>
    <line x1="9" y1="9" x2="15" y2="15"></line>
  </svg>
);

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

const BarChart = ({ size, className }: { size: number, className?: string }) => (
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
    <line x1="12" y1="20" x2="12" y2="10"></line>
    <line x1="18" y1="20" x2="18" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="16"></line>
  </svg>
);

export default AttendeesList;