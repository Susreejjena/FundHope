import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../api';
import { AlertCircle, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setStatus({
        type: 'error',
        message: 'Please enter your email address',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setStatus({ type: '', message: '' });
      
      const response = await authAPI.forgotPassword({ email });
      
      setStatus({
        type: 'success',
        message: 'If an account with that email exists, we have sent password reset instructions.',
      });
      
      // In a real app, we wouldn't log this token to the console
      console.log('Reset token for demo purposes:', response.data.resetToken);
      
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Something went wrong. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Forgot Password</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Enter your email and we'll send you instructions to reset your password
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
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPassword; 