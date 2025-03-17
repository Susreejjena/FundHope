import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api';

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifications: {
      email: true,
      campaigns: true,
      donations: true,
    }
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        setIsLoading(true);
        const { data } = await authAPI.getUserProfile();
        setFormData({
          ...formData,
          name: data.name || '',
          email: data.email || '',
          notifications: {
            ...formData.notifications,
            ...(data.preferences?.notifications || {})
          }
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // If unauthorized, redirect to login
        if (error.response?.status === 401) {
          navigate('/login');
        }
        setMessage({
          type: 'error',
          text: 'Failed to load profile data. Please try again.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    getUserProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      setIsSaving(true);
      const updateData = { 
        name: formData.name,
        email: formData.email,
        preferences: {
          notifications: formData.notifications
        }
      };
      
      // Add password fields if the user is updating their password
      if (formData.currentPassword && formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setMessage({ type: 'error', text: 'New passwords do not match' });
          setIsSaving(false);
          return;
        }
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }
      
      await authAPI.updateUserProfile(updateData);
      
      setMessage({
        type: 'success',
        text: 'Your profile has been updated successfully'
      });
      
      // Reset password fields
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update profile'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationChange = async (e) => {
    const { name, checked } = e.target;
    
    setFormData({
      ...formData,
      notifications: {
        ...formData.notifications,
        [name]: checked
      }
    });
    
    try {
      setIsSaving(true);
      // Update notification preferences by sending the entire user profile with updated preferences
      await authAPI.updateUserProfile({
        preferences: {
          notifications: {
            ...formData.notifications,
            [name]: checked
          }
        }
      });
      
      setMessage({
        type: 'success',
        text: 'Notification preferences updated'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update notification preferences'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 dark:text-white">Account Settings</h1>
        
        {/* Tabs */}
        <div className="mb-8 border-b dark:border-gray-700">
          <nav className="flex space-x-4">
            <button
              className={`pb-4 px-1 font-medium text-sm ${
                activeTab === 'account'
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('account')}
            >
              Account Details
            </button>
            <button
              className={`pb-4 px-1 font-medium text-sm ${
                activeTab === 'notifications'
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('notifications')}
            >
              Notification Settings
            </button>
            <button
              className={`pb-4 px-1 font-medium text-sm ${
                activeTab === 'privacy'
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('privacy')}
            >
              Privacy & Security
            </button>
          </nav>
        </div>
        
        {/* Feedback Message */}
        {message.text && (
          <div 
            className={`mb-6 p-4 rounded-md ${
              message.type === 'success' 
                ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' 
                : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
            }`}
          >
            {message.text}
          </div>
        )}
        
        {/* Account Details Tab */}
        {activeTab === 'account' && (
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Personal Information</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-500"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      readOnly
                      className="w-full px-4 py-2 border rounded-md bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 cursor-not-allowed"
                      placeholder="Your email"
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Email cannot be changed directly. Please contact support for assistance.
                    </p>
                  </div>
                </div>
                
                <div className="border-t dark:border-gray-700 pt-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4 dark:text-white">Change Password</h2>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-500"
                        placeholder="Current password"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-500"
                        placeholder="New password"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-500"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Notification Settings Tab */}
        {activeTab === 'notifications' && (
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Notification Preferences</h2>
              <form onSubmit={handleNotificationChange}>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="email"
                        name="email"
                        type="checkbox"
                        checked={formData.notifications.email}
                        onChange={handleNotificationChange}
                        className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="email" className="font-medium text-gray-700 dark:text-gray-300">
                        Email notifications
                      </label>
                      <p className="text-gray-500 dark:text-gray-400">
                        Receive important updates about your account via email.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="campaigns"
                        name="campaigns"
                        type="checkbox"
                        checked={formData.notifications.campaigns}
                        onChange={handleNotificationChange}
                        className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="campaigns" className="font-medium text-gray-700 dark:text-gray-300">
                        Campaign updates
                      </label>
                      <p className="text-gray-500 dark:text-gray-400">
                        Get notified about campaigns you've donated to or created.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="donations"
                        name="donations"
                        type="checkbox"
                        checked={formData.notifications.donations}
                        onChange={handleNotificationChange}
                        className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="donations" className="font-medium text-gray-700 dark:text-gray-300">Donation updates</label>
                      <p className="text-gray-500 dark:text-gray-400">
                        Receive notifications when someone donates to your campaigns or when there&apos;s a donation update.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Privacy & Security Tab */}
        {activeTab === 'privacy' && (
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Privacy & Security</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2 dark:text-white">Account Security</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Your account security is important to us. Here are some recommendations to keep your account safe:
                  </p>
                  <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400 space-y-2">
                    <li>Use a strong, unique password</li>
                    <li>Never share your login credentials</li>
                    <li>Update your password regularly</li>
                    <li>Be cautious of phishing attempts</li>
                  </ul>
                </div>
                
                <div className="border-t dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-medium mb-2 dark:text-white">Account Actions</h3>
                  <div className="space-y-4">
                    <button
                      type="button"
                      className="flex items-center text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                      onClick={() => {
                        // Display confirmation dialog before proceeding
                        if (window.confirm('Are you sure you want to deactivate your account? This action cannot be undone immediately.')) {
                          // Handle account deactivation
                          console.log('Account deactivation requested');
                          // In a real app, you would call an API endpoint
                        }
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                      Request Account Deactivation
                    </button>
                    
                    <button
                      type="button"
                      className="flex items-center text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                      onClick={() => {
                        // Display confirmation dialog before proceeding
                        if (window.confirm('Are you sure you want to download all your data? This process may take time to prepare.')) {
                          // Handle data download request
                          console.log('Data export requested');
                          // In a real app, you would call an API endpoint
                        }
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download Your Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings; 