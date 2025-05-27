import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, BookOpen, ArrowRight } from 'lucide-react';
import { useAuth, UserRole } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' as UserRole,
    studentId: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (formData.role === 'student' && !formData.studentId.trim()) {
      newErrors.studentId = 'Student ID is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.role,
        formData.role === 'student' ? formData.studentId : undefined
      );
      
      toast.success('Registration successful!');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to register. Please try again.');
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            <span className="text-primary-600">Logged</span>
            <span className="text-accent-500">In</span>
          </h1>
          <p className="text-gray-600">Create your account</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          {errors.general && (
            <div className="bg-error-50 text-error-700 p-3 rounded-lg mb-4">
              {errors.general}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-input pl-10 ${errors.name ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
                  placeholder="John Doe"
                  disabled={isLoading}
                />
              </div>
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>
            
            <div>
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input pl-10 ${errors.email ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
                  placeholder="you@example.com"
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`form-input pl-10 ${errors.password ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                </div>
                {errors.password && <p className="form-error">{errors.password}</p>}
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`form-input pl-10 ${errors.confirmPassword ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                </div>
                {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
              </div>
            </div>
            
            <div>
              <label className="form-label">Account Type</label>
              <div className="grid grid-cols-2 gap-4 mt-1">
                <label className={`flex items-center justify-center p-3 border ${formData.role === 'student' ? 'border-primary-500 bg-primary-50' : 'border-gray-300'} rounded-lg cursor-pointer`}>
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={formData.role === 'student'}
                    onChange={() => setFormData({ ...formData, role: 'student' })}
                    className="sr-only"
                    disabled={isLoading}
                  />
                  <BookOpen size={18} className={`mr-2 ${formData.role === 'student' ? 'text-primary-500' : 'text-gray-400'}`} />
                  <span className={formData.role === 'student' ? 'text-primary-700 font-medium' : 'text-gray-700'}>Student</span>
                </label>
                
                <label className={`flex items-center justify-center p-3 border ${formData.role === 'admin' ? 'border-primary-500 bg-primary-50' : 'border-gray-300'} rounded-lg cursor-pointer`}>
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={formData.role === 'admin'}
                    onChange={() => setFormData({ ...formData, role: 'admin' })}
                    className="sr-only"
                    disabled={isLoading}
                  />
                  <User size={18} className={`mr-2 ${formData.role === 'admin' ? 'text-primary-500' : 'text-gray-400'}`} />
                  <span className={formData.role === 'admin' ? 'text-primary-700 font-medium' : 'text-gray-700'}>Admin</span>
                </label>
              </div>
            </div>
            
            {formData.role === 'student' && (
              <div>
                <label htmlFor="studentId" className="form-label">
                  Student ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BookOpen size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="studentId"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    className={`form-input pl-10 ${errors.studentId ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
                    placeholder="STI-12345"
                    disabled={isLoading}
                  />
                </div>
                {errors.studentId && <p className="form-error">{errors.studentId}</p>}
              </div>
            )}
            
            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={16} className="ml-2" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;