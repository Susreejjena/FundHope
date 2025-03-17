import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../api';
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isComplete, setIsComplete] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setStatus({
        type: 'error',
        message: 'Invalid or missing reset token',
      });
    }
  }, [token]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password.length < 8) {
      setStatus({
        type: 'error',
        message: 'Password must be at least 8 characters long',
      });
      return;
    }

    if (password !== confirmPassword) {
      setStatus({
        type: 'error',
        message: 'Passwords do not match',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setStatus({ type: '', message: '' });
      
      await authAPI.resetPassword(token, { password });
      
      setStatus({
        type: 'success',
        message: 'Password has been reset successfully',
      });
      
      setIsComplete(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Invalid or expired reset token. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reset Password</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Create a new password for your account
          </p>
        </div>
        
        {status.message && (
          <div 
            className={`mb-6 p-4 rounded-md ${
              status.type === 'error' 
                ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200' 
                : 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
            }`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {status.type === 'error' ? (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm">{status.message}</p>
                {isComplete && (
                  <p className="text-sm mt-1">Redirecting to login page...</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              New Password
            </label>
            <div className="mt-1 relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white pr-10"
                required
                disabled={isComplete}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Password must be at least 8 characters
            </p>
          </div>
          
          <div>
            <label 
              htmlFor="confirmPassword" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Confirm New Password
            </label>
            <div className="mt-1">
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                required
                disabled={isComplete}
              />
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isSubmitting || isComplete || !token}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Remember your password?{' '}
            <Link to="/login" className="text-purple-600 hover:text-purple-500 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 