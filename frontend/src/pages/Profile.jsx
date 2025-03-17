import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
          navigate('/login');
          return;
        }

        const { data } = await authAPI.getUserProfile();
        setUser(data);
        
        // For now, we'll use mock donation data
        // In a real app, you would fetch the user's donations from the API
        setDonations([
          {
            id: '1',
            campaignTitle: 'Clean Water Initiative',
            amount: 25,
            date: new Date('2023-08-15').toISOString(),
            status: 'completed'
          },
          {
            id: '2',
            campaignTitle: 'Education for All',
            amount: 50,
            date: new Date('2023-09-20').toISOString(),
            status: 'completed'
          }
        ]);
      } catch (error) {
        console.error('Failed to load user profile', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 dark:text-white">My Profile</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
          <div className="border-b dark:border-gray-700">
            <nav className="flex">
              <button
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'profile'
                    ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                Profile
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'donations'
                    ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('donations')}
              >
                My Donations
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            {activeTab === 'profile' && user && (
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl mr-4">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span>{user.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold dark:text-white">{user.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                    <button 
                      onClick={() => navigate('/settings')}
                      className="mt-2 text-sm text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2 dark:text-white">Account Information</h3>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                      <div className="mb-3">
                        <span className="block text-sm text-gray-500 dark:text-gray-400">Member Since</span>
                        <span className="text-gray-800 dark:text-gray-200">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="block text-sm text-gray-500 dark:text-gray-400">Email Verified</span>
                        <span className="text-gray-800 dark:text-gray-200">
                          {user.isEmailVerified ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2 dark:text-white">Activity Summary</h3>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                      <div className="mb-3">
                        <span className="block text-sm text-gray-500 dark:text-gray-400">Total Donations</span>
                        <span className="text-gray-800 dark:text-gray-200">{donations.length}</span>
                      </div>
                      <div>
                        <span className="block text-sm text-gray-500 dark:text-gray-400">Amount Donated</span>
                        <span className="text-gray-800 dark:text-gray-200">
                          ${donations.reduce((total, donation) => total + donation.amount, 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'donations' && (
              <div>
                <h3 className="text-lg font-medium mb-4 dark:text-white">My Donation History</h3>
                
                {donations.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400">You haven't made any donations yet.</p>
                    <button
                      onClick={() => navigate('/discover')}
                      className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                    >
                      Discover Campaigns
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Campaign
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {donations.map((donation) => (
                          <tr key={donation.id}>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              {donation.campaignTitle}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              ${donation.amount.toFixed(2)}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {new Date(donation.date).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                {donation.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 