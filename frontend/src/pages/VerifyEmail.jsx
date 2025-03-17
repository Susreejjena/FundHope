import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyUserEmail = async () => {
      try {
        setVerificationStatus('verifying');
        const { data } = await authAPI.verifyEmail(token);
        setMessage(data.message || 'Your email has been successfully verified!');
        setVerificationStatus('success');
        
        // Redirect to login after success
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        setVerificationStatus('error');
        setMessage(
          error.response?.data?.message || 
          'Email verification failed. The link may be invalid or expired.'
        );
      }
    };

    if (token) {
      verifyUserEmail();
    } else {
      setVerificationStatus('error');
      setMessage('Verification token is missing.');
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Email Verification
          </h2>
        </div>
        
        <div className="mt-8 bg-white dark:bg-gray-800 py-8 px-4 shadow rounded-lg sm:px-10">
          {verificationStatus === 'verifying' && (
            <div className="text-center py-6">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Verifying your email address...
              </p>
            </div>
          )}
          
          {verificationStatus === 'success' && (
            <div className="text-center py-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                <svg
                  className="h-6 w-6 text-green-600 dark:text-green-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <p className="text-green-600 dark:text-green-400 font-medium mb-2">
                {message}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                You will be redirected to the login page in a few seconds.
              </p>
              <Link
                to="/login"
                className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
              >
                Click here if you are not redirected automatically
              </Link>
            </div>
          )}
          
          {verificationStatus === 'error' && (
            <div className="text-center py-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 mb-4">
                <svg
                  className="h-6 w-6 text-red-600 dark:text-red-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </div>
              <p className="text-red-600 dark:text-red-400 font-medium mb-4">
                {message}
              </p>
              <div className="flex flex-col space-y-2">
                <Link
                  to="/login"
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
                >
                  Go to Login
                </Link>
                <Link
                  to="/contact"
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail; 