import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { campaignAPI } from '../api';
import PropTypes from 'prop-types';

const categories = [
  'All Categories',
  'Education',
  'Medical',
  'Emergency Relief',
  'Environment',
  'Animals',
  'Community',
  'Business',
  'Creative',
  'Technology',
  'Other'
];

const Discover = ({ darkMode }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchCampaigns(1, true);
  }, [selectedCategory]);

  const fetchCampaigns = async (pageNumber, reset = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Only filter by category if not "All Categories"
      const categoryFilter = selectedCategory !== 'All Categories' ? selectedCategory : '';
      
      const { data } = await campaignAPI.getCampaigns(pageNumber, searchTerm, categoryFilter);
      
      if (reset) {
        setCampaigns(data.campaigns);
      } else {
        setCampaigns(prev => [...prev, ...data.campaigns]);
      }
      
      setPage(pageNumber);
      setHasMore(pageNumber < data.pages);
    } catch (err) {
      setError('Failed to load campaigns. Please try again.');
      console.error('Error fetching campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCampaigns(1, true);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchCampaigns(page + 1);
    }
  };

  const calculateProgress = (raised, goal) => {
    return Math.min(Math.round((raised / goal) * 100), 100);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate days left for a campaign
  const getDaysLeft = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Discover Campaigns</h1>
        
        {/* Search and Filter */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <form onSubmit={handleSearch} className="col-span-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-2 px-4 pr-10 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
                <button 
                  type="submit"
                  className="absolute right-0 top-0 mt-2 mr-3 text-gray-400"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
            
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full py-2 px-4 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}
        
        {/* Campaign Grid */}
        {loading && campaigns.length === 0 ? (
          <div className="flex justify-center my-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center my-16">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">No campaigns found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Try adjusting your search or filters</p>
            <Link 
              to="/create-campaign"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-md"
            >
              Start a Campaign
            </Link>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <div 
                  key={campaign._id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={campaign.image} 
                      alt={campaign.title} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2 dark:text-white">{campaign.title}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{campaign.shortDescription}</p>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">
                          {formatCurrency(campaign.raised)} of {formatCurrency(campaign.goal)}
                        </span>
                        <span className="font-medium text-purple-600 dark:text-purple-400">
                          {calculateProgress(campaign.raised, campaign.goal)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${calculateProgress(campaign.raised, campaign.goal)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mb-4 text-sm">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{getDaysLeft(campaign.endDate)} days left</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>{campaign.donations?.length || 0} donors</span>
                      </div>
                    </div>
                    
                    <Link 
                      to={`/campaign/${campaign._id}`}
                      className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 text-center rounded-md transition-colors"
                    >
                      View Campaign
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="bg-white dark:bg-gray-800 border border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-700 font-medium px-6 py-2 rounded-md transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-purple-600 dark:text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </span>
                  ) : 'Load More Campaigns'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

Discover.propTypes = {
  darkMode: PropTypes.bool
};

export default Discover;