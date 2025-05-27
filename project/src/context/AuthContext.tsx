import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// Types
export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string; // Only for students
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole, studentId?: string) => Promise<void>;
  logout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          // For this MVP, we're using localStorage
          // In a real app, we would validate the token with the backend
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock API call for now
      // In a real app, this would be a real API call
      // const response = await api.post('/auth/login', { email, password });
      
      // Mock response for demo
      let mockUser: User;
      
      if (email === 'admin@sti.edu' && password === 'admin123') {
        mockUser = {
          id: '1',
          name: 'Admin User',
          email: 'admin@sti.edu',
          role: 'admin'
        };
        
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        
        // Clear previous dashboard visit flag for admin
        localStorage.removeItem('hasVisitedAdminDashboard');
        navigate('/admin');
      } else {
        // Assume student login
        mockUser = {
          id: '2',
          name: 'Student User',
          email: email,
          role: 'student',
          studentId: 'STI-' + Math.floor(10000 + Math.random() * 90000)
        };
        
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        
        // Clear previous dashboard visit flag for student
        localStorage.removeItem('hasVisitedDashboard');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string, role: UserRole, studentId?: string) => {
    setIsLoading(true);
    try {
      // Mock API call
      // const response = await api.post('/auth/register', { name, email, password, role, studentId });
      
      // Mock successful registration
      const mockUser: User = {
        id: '3',
        name,
        email,
        role,
        studentId
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isAuthenticated: !!user,
      login, 
      register, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};