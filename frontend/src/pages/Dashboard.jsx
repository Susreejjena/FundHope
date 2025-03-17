import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { campaignAPI, donationAPI, BASE_URL } from '../api';
import { BarChart, Wallet, Users, Plus, Clock, LayoutDashboard, Settings, Activity } from 'lucide-react';

const Dashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalRaised: 0,
    activeCampaigns: 0,
    totalDonations: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    
    if (!userInfo) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch user's campaigns
        const { data } = await campaignAPI.getUserCampaigns();
        
        // Process image URLs to ensure they're absolute
        if (data && Array.isArray(data)) {
          const processedCampaigns = data.map(campaign => {
            if (campaign.image && !campaign.image.startsWith('http')) {
              return { ...campaign, image: `${BASE_URL}/${campaign.image}` };
            }
            return campaign;
          });
          setCampaigns(processedCampaigns);
        } else {
          setCampaigns([]);
        }
        
        // Fetch user's donations
        const donationsResponse = await donationAPI.getUserDonations();
        setDonations(donationsResponse.data || []);
        
        // Calculate stats
        const userCampaigns = data || [];
        const totalRaised = userCampaigns.reduce((sum, campaign) => sum + campaign.raised, 0);
        const activeCampaigns = userCampaigns.filter(c => c.status === 'active').length;
        const totalDonations = donationsResponse.data?.length || 0;
        
        setStats({
          totalRaised,
          activeCampaigns,
          totalDonations,
        });
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);
  
  // For demo purposes, let's define some mock data in case the API isn't fully implemented yet
  useEffect(() => {
    if (isLoading && campaigns.length === 0) {
      const mockCampaigns = [
        {
          _id: 'c1',
          title: 'Help Build a Community Garden',
          image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735',
          goal: 10000,
          raised: 7500,
          status: 'active',
          endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          donations: 42,
        },
        {
          _id: 'c2',
          title: 'Education for Rural Children',
          image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6',
          goal: 15000,
          raised: 9000,
          status: 'active',
          endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
          donations: 27,
        },
      ];
      
      const mockDonations = [
        {
          _id: 'd1',
          amount: 100,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          campaign: {
            _id: 'c1',
            title: 'Help Build a Community Garden',
            image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735',
          },
        },
        {
          _id: 'd2',
          amount: 50,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          campaign: {
            _id: 'c2',
            title: 'Education for Rural Children',
            image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6',
          },
        },
      ];
      
      setCampaigns(mockCampaigns);
      setDonations(mockDonations);
      setStats({
        totalRaised: 16500,
        activeCampaigns: 2,
        totalDonations: 69,
      });
      setIsLoading(false);
    }
  }, [isLoading, campaigns]);

  const renderDaysLeft = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'Ended';
    if (diffDays === 1) return '1 day left';
    return `${diffDays} days left`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Raised</h3>
                  <Wallet className="h-8 w-8 text-purple-500" />
                </div>
                <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{formatCurrency(stats.totalRaised)}</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">Active Campaigns</h3>
                  <Activity className="h-8 w-8 text-green-500" />
                </div>
                <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{stats.activeCampaigns}</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Donations</h3>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
                <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{stats.totalDonations}</p>
              </div>
            </div>
            
            {/* Campaign List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Campaigns</h2>
              </div>
              
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {campaigns.length > 0 ? (
                  campaigns.map((campaign) => (
                    <div key={campaign._id} className="p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
                      <img 
                        src={campaign.image} 
                        alt={campaign.title} 
                        className="w-full md:w-32 h-24 md:h-20 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{campaign.title}</h3>
                        <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {renderDaysLeft(campaign.endDate)}
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {formatCurrency(campaign.raised)}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              of {formatCurrency(campaign.goal)}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {campaign.donations} donations
                          </span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ width: `${Math.min((campaign.raised / campaign.goal) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="flex gap-2 self-end md:self-center">
                        <Link 
                          to={`/campaign/${campaign._id}`} 
                          className="px-3 py-1.5 text-xs font-medium text-white bg-purple-600 rounded hover:bg-purple-700"
                        >
                          View
                        </Link>
                        <Link 
                          to={`/campaign/${campaign._id}/edit`} 
                          className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-gray-600 dark:text-gray-400">You haven't created any campaigns yet.</p>
                    <Link 
                      to="/create-campaign" 
                      className="inline-flex items-center mt-4 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Campaign
                    </Link>
                  </div>
                )}
              </div>
            </div>
            
            {/* Recent Donations */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Donations</h2>
              </div>
              
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {donations.length > 0 ? (
                  donations.map((donation) => (
                    <div key={donation._id} className="p-6 flex items-center gap-4">
                      <img 
                        src={donation.campaign.image} 
                        alt={donation.campaign.title} 
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <h3 className="text-base font-medium text-gray-900 dark:text-white">{donation.campaign.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(donation.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(donation.amount)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-gray-600 dark:text-gray-400">No donations yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      
      case 'campaigns':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">All Campaigns</h2>
              <Link 
                to="/create-campaign" 
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Campaign
              </Link>
            </div>
            
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {campaigns.length > 0 ? (
                campaigns.map((campaign) => (
                  <div key={campaign._id} className="p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
                    <img 
                      src={campaign.image} 
                      alt={campaign.title} 
                      className="w-full md:w-32 h-24 md:h-20 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{campaign.title}</h3>
                      <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                        <span className={`px-2 py-1 text-xs rounded ${
                          campaign.status === 'active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {renderDaysLeft(campaign.endDate)}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatCurrency(campaign.raised)}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            of {formatCurrency(campaign.goal)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${Math.min((campaign.raised / campaign.goal) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2 self-end md:self-center">
                      <Link 
                        to={`/campaign/${campaign._id}`} 
                        className="px-3 py-1.5 text-xs font-medium text-white bg-purple-600 rounded hover:bg-purple-700"
                      >
                        View
                      </Link>
                      <Link 
                        to={`/campaign/${campaign._id}/edit`} 
                        className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-600 dark:text-gray-400">You haven't created any campaigns yet.</p>
                </div>
              )}
            </div>
          </div>
        );
      
      case 'donations':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">All Donations</h2>
            </div>
            
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {donations.length > 0 ? (
                donations.map((donation) => (
                  <div key={donation._id} className="p-6 flex items-center gap-4">
                    <img 
                      src={donation.campaign.image} 
                      alt={donation.campaign.title} 
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="text-base font-medium text-gray-900 dark:text-white">{donation.campaign.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(donation.amount)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-600 dark:text-gray-400">No donations yet.</p>
                  <Link 
                    to="/discover" 
                    className="inline-flex items-center mt-4 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
                  >
                    Discover Campaigns
                  </Link>
                </div>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Manage your campaigns and donations</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition ${
                    activeTab === 'overview'
                      ? 'bg-purple-100 text-purple-900 dark:bg-purple-900/30 dark:text-purple-200'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <LayoutDashboard className="mr-3 h-5 w-5" />
                  Overview
                </button>
                
                <button
                  onClick={() => setActiveTab('campaigns')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition ${
                    activeTab === 'campaigns'
                      ? 'bg-purple-100 text-purple-900 dark:bg-purple-900/30 dark:text-purple-200'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <BarChart className="mr-3 h-5 w-5" />
                  Campaigns
                </button>
                
                <button
                  onClick={() => setActiveTab('donations')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition ${
                    activeTab === 'donations'
                      ? 'bg-purple-100 text-purple-900 dark:bg-purple-900/30 dark:text-purple-200'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Wallet className="mr-3 h-5 w-5" />
                  Donations
                </button>

                <Link
                  to="/profile"
                  className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <Settings className="mr-3 h-5 w-5" />
                  Settings
                </Link>
              </nav>
            </div>

            <div className="mt-6 bg-purple-600 rounded-lg shadow p-6 text-white">
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-purple-100 mb-4">Have questions or need assistance with your campaigns?</p>
              <Link 
                to="/contact" 
                className="inline-block w-full px-4 py-2 text-sm font-medium text-center text-purple-600 bg-white rounded-lg hover:bg-purple-50"
              >
                Contact Support
              </Link>
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : (
              renderTabContent()
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 