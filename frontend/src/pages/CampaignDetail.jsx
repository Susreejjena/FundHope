import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { campaignAPI, BASE_URL } from '../api';

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('story');

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await campaignAPI.getCampaignById(id);
        
        // Ensure image URL is absolute
        if (data && data.image && !data.image.startsWith('http')) {
          data.image = `${BASE_URL}/${data.image}`;
        }
        
        setCampaign(data);
      } catch (err) {
        setError('Failed to load campaign details. Please try again.');
        console.error('Error fetching campaign:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignDetails();
  }, [id]);

  // Calculate days left for a campaign
  const getDaysLeft = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Calculate progress percentage
  const calculateProgress = (raised, goal) => {
    return Math.min(Math.round((raised / goal) * 100), 100);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Oops! Something went wrong</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">{error || 'Campaign not found'}</p>
          <Link 
            to="/discover" 
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg"
          >
            Browse Campaigns
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <Link to="/discover" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                    Discover
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-gray-500 dark:text-gray-300">{campaign.title}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        
        {/* Campaign Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-6 dark:text-white">{campaign.title}</h1>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Campaign Details */}
          <div className="lg:col-span-2">
            {/* Campaign Image */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
              <img 
                src={campaign.image} 
                alt={campaign.title} 
                className="w-full h-auto object-cover"
              />
            </div>
            
            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
              <div className="border-b dark:border-gray-700">
                <nav className="flex">
                  <button
                    className={`px-6 py-3 text-sm font-medium ${
                      activeTab === 'story'
                        ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                    onClick={() => setActiveTab('story')}
                  >
                    Story
                  </button>
                  <button
                    className={`px-6 py-3 text-sm font-medium ${
                      activeTab === 'updates'
                        ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                    onClick={() => setActiveTab('updates')}
                  >
                    Updates {campaign.updates?.length > 0 && `(${campaign.updates.length})`}
                  </button>
                  <button
                    className={`px-6 py-3 text-sm font-medium ${
                      activeTab === 'donors'
                        ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                    onClick={() => setActiveTab('donors')}
                  >
                    Donors {campaign.donations?.length > 0 && `(${campaign.donations.length})`}
                  </button>
                </nav>
              </div>
              
              <div className="p-6">
                {activeTab === 'story' && (
                  <div className="prose dark:prose-invert max-w-none">
                    <h2 className="text-xl font-semibold mb-4 dark:text-white">About This Campaign</h2>
                    <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">{campaign.description}</p>
                  </div>
                )}
                
                {activeTab === 'updates' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4 dark:text-white">Campaign Updates</h2>
                    
                    {campaign.updates?.length > 0 ? (
                      <div className="space-y-6">
                        {campaign.updates.map((update, index) => (
                          <div key={index} className="border-b dark:border-gray-700 pb-6 last:border-b-0 last:pb-0">
                            <h3 className="font-semibold mb-1 dark:text-white">{update.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                              {formatDate(update.date)}
                            </p>
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{update.content}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400">No updates have been posted yet.</p>
                    )}
                  </div>
                )}
                
                {activeTab === 'donors' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4 dark:text-white">Donors</h2>
                    
                    {campaign.donations?.length > 0 ? (
                      <div className="space-y-4">
                        {campaign.donations.map((donation, index) => (
                          <div key={index} className="flex items-center justify-between border-b dark:border-gray-700 pb-4 last:border-b-0 last:pb-0">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 mr-3">
                                {donation.isAnonymous ? 'A' : donation.name?.charAt(0).toUpperCase() || 'D'}
                              </div>
                              <div>
                                <p className="font-medium dark:text-white">
                                  {donation.isAnonymous ? 'Anonymous' : donation.name || 'Donor'}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {formatDate(donation.createdAt)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900 dark:text-white">
                                {formatCurrency(donation.amount)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400">No donations have been made yet. Be the first to donate!</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Column - Donation Panel */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-8">
              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(campaign.raised)} raised
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    of {formatCurrency(campaign.goal)} goal
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-3">
                  <div 
                    className="bg-purple-600 h-3 rounded-full" 
                    style={{ width: `${calculateProgress(campaign.raised, campaign.goal)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <div className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">{calculateProgress(campaign.raised, campaign.goal)}%</span> funded
                  </div>
                  <div className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">{getDaysLeft(campaign.endDate)}</span> days left
                  </div>
                </div>
              </div>
              
              {/* Campaign Details */}
              <div className="mb-6 space-y-3">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">End Date</p>
                    <p className="text-gray-900 dark:text-white">{formatDate(campaign.endDate)}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                    <p className="text-gray-900 dark:text-white">{campaign.category}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Created by</p>
                    <p className="text-gray-900 dark:text-white">
                      {campaign.creator?.name || 'Anonymous'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Donate Button */}
              <button
                onClick={() => navigate(`/donate/${campaign._id}`)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-md transition-colors"
              >
                Donate Now
              </button>
              
              {/* Share */}
              <div className="mt-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Share this campaign</p>
                <div className="flex space-x-2">
                  <button className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full" title="Share on Facebook">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                    </svg>
                  </button>
                  <button className="p-2 bg-blue-400 hover:bg-blue-500 text-white rounded-full" title="Share on Twitter">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </button>
                  <button className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full" title="Share on WhatsApp">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                  </button>
                  <button className="p-2 bg-blue-700 hover:bg-blue-800 text-white rounded-full" title="Share via Email">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;
