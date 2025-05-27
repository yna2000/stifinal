import React, { useState, useEffect } from 'react';
import { mockApi } from '../services/api';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { Calendar, Users, TrendingUp, Clock } from 'lucide-react';
import { format, subDays } from 'date-fns';
import StatCard from '../components/admin/StatCard';

const AdminAnalytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await mockApi.getAnalytics();
        setAnalyticsData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
        setIsLoading(false);
      }
    };
    
    fetchAnalytics();
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse-slow flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }
  
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Track event performance and student engagement</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <select 
            className="form-input py-1.5 text-sm"
            defaultValue="7"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Students" 
          value={analyticsData?.overview.totalStudents} 
          icon={<Users size={20} className="text-primary-500" />}
          color="bg-primary-50"
          change={{ value: 12, isPositive: true }}
        />
        
        <StatCard 
          title="Active Events" 
          value={analyticsData?.overview.activeEvents} 
          icon={<Calendar size={20} className="text-accent-500" />}
          color="bg-accent-50"
          change={{ value: 5, isPositive: true }}
        />
        
        <StatCard 
          title="Total Check-ins" 
          value={analyticsData?.overview.totalCheckins} 
          icon={<TrendingUp size={20} className="text-success-500" />}
          color="bg-success-50"
          change={{ value: 25, isPositive: true }}
        />
        
        <StatCard 
          title="Avg. Response Time" 
          value={analyticsData?.overview.avgResponseTime + 'min'} 
          icon={<Clock size={20} className="text-warning-500" />}
          color="bg-warning-50"
          change={{ value: 15, isPositive: false }}
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Attendance Trends */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-6">Event Attendance Trends</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData?.attendanceTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => format(new Date(date), 'MMM d')}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(date) => format(new Date(date), 'MMMM d, yyyy')}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Event Categories Distribution */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-6">Event Categories</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData?.eventCategories}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label
                >
                  {analyticsData?.eventCategories.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Student Engagement by Day */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-6">Daily Student Engagement</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData?.dailyEngagement}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="joins" fill="#3B82F6" name="Event Joins" />
                <Bar dataKey="checkins" fill="#10B981" name="Check-ins" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Popular Event Times */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-6">Popular Event Times</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData?.popularTimes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="attendance" fill="#3B82F6" name="Attendance" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Event Performance Table */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Event Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registered
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Checked In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendance Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analyticsData?.eventPerformance.map((event: any) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{event.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {format(new Date(event.date), 'MMM d, yyyy')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{event.registered}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{event.checkedIn}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${
                      event.attendanceRate >= 80 ? 'text-success-600' :
                      event.attendanceRate >= 60 ? 'text-warning-600' :
                      'text-error-600'
                    }`}>
                      {event.attendanceRate}%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;