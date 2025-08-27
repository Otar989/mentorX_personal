import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onToggleForm, showSignup = false }) => {
  const { signIn, signUp, loading, authError, clearError } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user starts typing
    if (authError) clearError();
    if (validationError) setValidationError(null);
  };

  const validateForm = () => {
    if (!formData?.email || !formData?.password) {
      setValidationError('Please fill in all required fields');
      return false;
    }

    if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      setValidationError('Please enter a valid email address');
      return false;
    }

    if (formData?.password?.length < 6) {
      setValidationError('Password must be at least 6 characters long');
      return false;
    }

    if (showSignup) {
      if (!formData?.full_name?.trim()) {
        setValidationError('Full name is required');
        return false;
      }
      
      if (formData?.password !== formData?.confirmPassword) {
        setValidationError('Passwords do not match');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    try {
      let result;
      
      if (showSignup) {
        result = await signUp(formData?.email, formData?.password, {
          full_name: formData?.full_name?.trim()
        });
      } else {
        result = await signIn(formData?.email, formData?.password);
      }

      if (result?.user && !result?.error) {
        // Successful authentication
        const userRole = result?.user?.user_metadata?.role || 'student';
        
        // Navigate based on user role
        switch (userRole) {
          case 'admin': navigate('/admin-panel');
            break;
          case 'instructor': navigate('/instructor-dashboard');
            break;
          case 'company_admin': navigate('/company-dashboard');
            break;
          default:
            navigate('/student-dashboard');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setValidationError('An unexpected error occurred. Please try again.');
    }
  };

  const displayError = validationError || authError;

  return (
    <div className="w-full max-w-md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-xl p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <LogIn className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {showSignup ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-gray-600">
            {showSignup 
              ? 'Join MentorX and start your learning journey' :'Sign in to continue your learning'
            }
          </p>
        </div>

        {/* Error Display */}
        {displayError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{displayError}</span>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name (Signup only) */}
          {showSignup && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData?.full_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Enter your full name"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <div className="w-5 h-5 text-gray-400 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium">👤</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Email */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: showSignup ? 0.4 : 0.3 }}
          >
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData?.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Enter your email"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: showSignup ? 0.5 : 0.4 }}
          >
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData?.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Enter your password"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </motion.div>

          {/* Confirm Password (Signup only) */}
          {showSignup && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData?.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Confirm your password"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: showSignup ? 0.7 : 0.5 }}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{showSignup ? 'Creating Account...' : 'Signing In...'}</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>{showSignup ? 'Create Account' : 'Sign In'}</span>
              </>
            )}
          </motion.button>
        </form>

        {/* Toggle Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center"
        >
          <p className="text-gray-600">
            {showSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={onToggleForm}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              {showSignup ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </motion.div>

        {/* Demo Credentials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-4 p-3 bg-gray-50 rounded-lg text-center"
        >
          <p className="text-xs text-gray-600 mb-2">Demo Credentials:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white p-2 rounded">
              <p className="font-medium text-gray-700">Student:</p>
              <p className="text-gray-600">student1@mentorx.com</p>
              <p className="text-gray-600">student123</p>
            </div>
            <div className="bg-white p-2 rounded">
              <p className="font-medium text-gray-700">Instructor:</p>
              <p className="text-gray-600">instructor@mentorx.com</p>
              <p className="text-gray-600">instructor123</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginForm;