import axios from 'axios';
import { format, subDays } from 'date-fns';

// Create axios instance with default config
const api = axios.create({
  // In a real app, this would be your actual API URL
  baseURL: 'https://api.example.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');
  
  if (user) {
    const { token } = JSON.parse(user);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Handle authentication errors
    if (response && response.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Mock API functions
export const mockApi = {
  // Auth
  login: async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (email === 'admin@sti.edu' && password === 'admin123') {
      return {
        user: {
          id: '1',
          name: 'Admin User',
          email: 'admin@sti.edu',
          role: 'admin',
          token: 'mock-admin-token'
        }
      };
    } else if (email && password) {
      return {
        user: {
          id: '2',
          name: 'Student User',
          email: email,
          role: 'student',
          studentId: 'STI-' + Math.floor(10000 + Math.random() * 90000),
          token: 'mock-student-token'
        }
      };
    }
    
    throw { response: { status: 401, data: { message: 'Invalid credentials' } } };
  },
  
  // Events
  getEvents: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      events: [
        {
          id: '1',
          title: 'Tech Workshop',
          description: 'Learn the latest in web development technologies.',
          date: new Date(Date.now() + 86400000), // Tomorrow
          location: 'STI Main Campus - Room 301',
          capacity: 50,
          registered: 32,
          image: 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
          id: '2',
          title: 'Career Fair',
          description: 'Meet representatives from top tech companies.',
          date: new Date(Date.now() + 86400000 * 3), // 3 days from now
          location: 'STI Main Campus - Auditorium',
          capacity: 200,
          registered: 150,
          image: 'https://images.pexels.com/photos/1056553/pexels-photo-1056553.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
          id: '3',
          title: 'Programming Contest',
          description: 'Test your coding skills and win prizes.',
          date: new Date(Date.now() + 86400000 * 5), // 5 days from now
          location: 'STI Main Campus - Computer Lab',
          capacity: 30,
          registered: 25,
          image: 'https://images.pexels.com/photos/1181290/pexels-photo-1181290.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
          id: '4',
          title: 'Networking Night',
          description: 'Build connections with industry professionals.',
          date: new Date(Date.now() + 86400000 * 7), // 7 days from now
          location: 'STI Main Campus - Function Hall',
          capacity: 100,
          registered: 45,
          image: 'https://images.pexels.com/photos/7176026/pexels-photo-7176026.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        }
      ]
    };
  },
  
  // Single event
  getEvent: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const mockEvents = [
      {
        id: '1',
        title: 'Tech Workshop',
        description: 'Learn the latest in web development technologies. This workshop will cover modern JavaScript frameworks, responsive design principles, and deployment strategies. Bring your laptop and be ready to code!',
        date: new Date(Date.now() + 86400000), // Tomorrow
        location: 'STI Main Campus - Room 301',
        capacity: 50,
        registered: 32,
        image: 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        organizer: 'IT Department'
      },
      {
        id: '2',
        title: 'Career Fair',
        description: 'Meet representatives from top tech companies. This is your chance to network with potential employers, distribute your resume, and learn about job opportunities in the industry.',
        date: new Date(Date.now() + 86400000 * 3), // 3 days from now
        location: 'STI Main Campus - Auditorium',
        capacity: 200,
        registered: 150,
        image: 'https://images.pexels.com/photos/1056553/pexels-photo-1056553.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        organizer: 'Career Services'
      },
      {
        id: '3',
        title: 'Programming Contest',
        description: 'Test your coding skills and win prizes. Participants will solve algorithmic challenges within a time limit. Prizes include tech gadgets and internship opportunities with sponsor companies.',
        date: new Date(Date.now() + 86400000 * 5), // 5 days from now
        location: 'STI Main Campus - Computer Lab',
        capacity: 30,
        registered: 25,
        image: 'https://images.pexels.com/photos/1181290/pexels-photo-1181290.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        organizer: 'Computer Science Club'
      },
      {
        id: '4',
        title: 'Networking Night',
        description: 'Build connections with industry professionals. This semi-formal event includes a keynote speech, panel discussion, and open networking session with refreshments provided.',
        date: new Date(Date.now() + 86400000 * 7), // 7 days from now
        location: 'STI Main Campus - Function Hall',
        capacity: 100,
        registered: 45,
        image: 'https://images.pexels.com/photos/7176026/pexels-photo-7176026.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        organizer: 'Alumni Association'
      }
    ];
    
    const event = mockEvents.find(e => e.id === id);
    
    if (event) {
      return { event };
    }
    
    throw { response: { status: 404, data: { message: 'Event not found' } } };
  },
  
  // Join event
  joinEvent: async (eventId: string, userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: 'Successfully joined event',
      qrCode: `${userId}-${eventId}-${Date.now()}`
    };
  },
  
  // Create event (admin)
  createEvent: async (eventData: any) => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const newEvent = {
      id: Math.random().toString(36).substring(2, 9),
      ...eventData,
      registered: 0,
      attendees: []
    };
    
    // Notify admin about new event creation
    setTimeout(() => {
      const notification = {
        type: 'admin_alert',
        title: 'New Event Created',
        message: `Event "${newEvent.title}" has been created successfully.`
      };
      // In a real app, this would be handled by a notification service
      console.log('Admin notification:', notification);
    }, 500);
    
    return {
      success: true,
      event: newEvent
    };
  },
  
  // Get user's joined events
  getUserEvents: async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    return {
      events: [
        {
          id: '1',
          title: 'Tech Workshop',
          date: new Date(Date.now() + 86400000), // Tomorrow
          location: 'STI Main Campus - Room 301',
          qrCode: `${userId}-1-${Date.now() - 86400000 * 2}`,
          joinedAt: new Date(Date.now() - 86400000 * 2)
        },
        {
          id: '3',
          title: 'Programming Contest',
          date: new Date(Date.now() + 86400000 * 5), // 5 days from now
          location: 'STI Main Campus - Computer Lab',
          qrCode: `${userId}-3-${Date.now() - 86400000}`,
          joinedAt: new Date(Date.now() - 86400000)
        }
      ]
    };
  },
  
  // Get event attendees (admin)
  getEventAttendees: async (eventId: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      attendees: [
        { 
          id: '101', 
          name: 'John Doe', 
          studentId: 'STI-12345', 
          joinedAt: new Date(Date.now() - 86400000 * 2),
          status: 'attended'
        },
        { 
          id: '102', 
          name: 'Jane Smith', 
          studentId: 'STI-23456', 
          joinedAt: new Date(Date.now() - 86400000),
          status: 'attended'
        },
        { 
          id: '103', 
          name: 'Mike Johnson', 
          studentId: 'STI-34567', 
          joinedAt: new Date(Date.now() - 43200000),
          status: 'joined'
        },
        { 
          id: '104', 
          name: 'Sarah Williams', 
          studentId: 'STI-45678', 
          joinedAt: new Date(Date.now() - 21600000),
          status: 'absent'
        },
        { 
          id: '105', 
          name: 'Chris Davis', 
          studentId: 'STI-56789', 
          joinedAt: new Date(Date.now() - 3600000),
          status: 'joined'
        }
      ]
    };
  },
  
  // Get admin dashboard stats
  getAdminStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 900));
    
    return {
      stats: {
        totalStudents: 256,
        totalEvents: 12,
        upcomingEvents: 4,
        totalAttendance: 478,
        recentJoins: [
          { studentName: 'John Doe', eventTitle: 'Tech Workshop', time: new Date(Date.now() - 1800000) },
          { studentName: 'Jane Smith', eventTitle: 'Career Fair', time: new Date(Date.now() - 3600000) },
          { studentName: 'Mike Johnson', eventTitle: 'Programming Contest', time: new Date(Date.now() - 7200000) }
        ]
      }
    };
  },

  // Analytics endpoint
  getAnalytics: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate mock data for the last 7 days
    const attendanceTrends = Array.from({ length: 7 }, (_, i) => ({
      date: subDays(new Date(), 6 - i).toISOString(),
      attendance: Math.floor(Math.random() * 50) + 30
    }));
    
    const eventCategories = [
      { name: 'Tech Workshops', value: 35 },
      { name: 'Career Events', value: 25 },
      { name: 'Social Gatherings', value: 20 },
      { name: 'Academic Seminars', value: 20 }
    ];
    
    const dailyEngagement = [
      { day: 'Mon', joins: 45, checkins: 40 },
      { day: 'Tue', joins: 52, checkins: 48 },
      { day: 'Wed', joins: 38, checkins: 35 },
      { day: 'Thu', joins: 65, checkins: 60 },
      { day: 'Fri', joins: 48, checkins: 44 },
      { day: 'Sat', joins: 25, checkins: 22 },
      { day: 'Sun', joins: 20, checkins: 18 }
    ];
    
    const popularTimes = Array.from({ length: 12 }, (_, i) => ({
      hour: `${(i + 8)}:00`,
      attendance: Math.floor(Math.random() * 40) + 10
    }));
    
    const eventPerformance = [
      {
        id: '1',
        name: 'Tech Workshop',
        date: new Date(),
        registered: 50,
        checkedIn: 45,
        attendanceRate: 90
      },
      {
        id: '2',
        name: 'Career Fair',
        date: subDays(new Date(), 1),
        registered: 200,
        checkedIn: 180,
        attendanceRate: 90
      },
      {
        id: '3',
        name: 'Programming Contest',
        date: subDays(new Date(), 2),
        registered: 30,
        checkedIn: 25,
        attendanceRate: 83
      },
      {
        id: '4',
        name: 'Networking Night',
        date: subDays(new Date(), 3),
        registered: 100,
        checkedIn: 75,
        attendanceRate: 75
      }
    ];
    
    return {
      data: {
        overview: {
          totalStudents: 256,
          activeEvents: 12,
          totalCheckins: 478,
          avgResponseTime: 5
        },
        attendanceTrends,
        eventCategories,
        dailyEngagement,
        popularTimes,
        eventPerformance
      }
    };
  }
};

export default api;