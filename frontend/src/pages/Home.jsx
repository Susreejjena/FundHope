import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { campaignAPI, BASE_URL } from '../api';
import PropTypes from 'prop-types';

const campaigns = [
  {
    id: "1",
    title: "Help Build a Community Garden",
    description: "Creating a sustainable garden to provide fresh produce for local families in need.",
    image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735",
    goal: "₹10,000",
    raised: "₹7,500",
    daysLeft: 15,
  },
  {
    id: "2",
    title: "Education for Rural Children",
    description: "Providing educational resources and supplies to children in remote areas.",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6",
    goal: "₹15,000",
    raised: "₹9,000",
    daysLeft: 20,
  },
  {
    id: "3",
    title: "Clean Water Initiative",
    description: "Installing water purification systems in communities without access to clean water.",
    image: "https://images.unsplash.com/photo-1538300342682-cf57afb97285",
    goal: "₹20,000",
    raised: "₹12,000",
    daysLeft: 25,
  },
];

// Testimonials data
const testimonials = [
  {
    name: "Priya Sharma",
    message: "This platform helped us raise funds for our local school renovation. So grateful!",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Arjun Mehta",
    message: "An intuitive and powerful way to support causes I truly care about.",
    avatar: "https://randomuser.me/api/portraits/men/36.jpg",
  },
];

const Home = () => {
  const [featuredCampaigns, setFeaturedCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeaturedCampaigns = async () => {
    try {
      setLoading(true);
      // Fetch campaigns from API - use first page with no filters
      const { data } = await campaignAPI.getCampaigns(1, '', '');
      
      if (data && data.campaigns && data.campaigns.length > 0) {
        // Process image URLs to ensure they're absolute
        const processedCampaigns = data.campaigns.map(campaign => {
          if (campaign.image && !campaign.image.startsWith('http')) {
            return { ...campaign, image: `${BASE_URL}/${campaign.image}` };
          }
          return campaign;
        });
        
        setFeaturedCampaigns(processedCampaigns);
      } else {
        // Fallback to mock data if no campaigns are returned
        const mockCampaigns = [
          {
            _id: '1',
            title: 'Help Build a Community Garden',
            shortDescription: 'Creating a sustainable garden to provide fresh produce for local families in need.',
            image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735',
            goal: 10000,
            raised: 7500,
            endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            category: 'Community'
          },
          {
            _id: '2',
            title: 'Education for Rural Children',
            shortDescription: 'Providing educational resources and supplies to children in remote areas.',
            image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6',
            goal: 15000,
            raised: 9000, 
            endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
            category: 'Education'
          },
          {
            _id: '3',
            title: 'Clean Water Initiative',
            shortDescription: 'Installing water purification systems in communities without access to clean water.',
            image: 'https://images.unsplash.com/photo-1538300342682-cf57afb97285',
            goal: 20000,
            raised: 12000,
            endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
            category: 'Medical'
          }
        ];
        setFeaturedCampaigns(mockCampaigns);
      }
    } catch (err) {
      console.error('Error fetching featured campaigns:', err);
      // Load mock data as fallback in case of error
      const mockCampaigns = [
        {
          _id: '1',
          title: 'Help Build a Community Garden',
          shortDescription: 'Creating a sustainable garden to provide fresh produce for local families in need.',
          image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735',
          goal: 10000,
          raised: 7500,
          endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          category: 'Community'
        },
        {
          _id: '2',
          title: 'Education for Rural Children',
          shortDescription: 'Providing educational resources and supplies to children in remote areas.',
          image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6',
          goal: 15000,
          raised: 9000, 
          endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
          category: 'Education'
        },
        {
          _id: '3',
          title: 'Clean Water Initiative',
          shortDescription: 'Installing water purification systems in communities without access to clean water.',
          image: 'https://images.unsplash.com/photo-1538300342682-cf57afb97285',
          goal: 20000,
          raised: 12000,
          endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
          category: 'Medical'
        }
      ];
      setFeaturedCampaigns(mockCampaigns);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedCampaigns();
    
    // Set up an interval to refresh campaigns every 30 seconds
    const refreshInterval = setInterval(() => {
      fetchFeaturedCampaigns();
    }, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(refreshInterval);
  }, []);

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

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 min-h-[600px] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="absolute top-0 right-0 w-2/5 h-full hidden lg:block">
          <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" className="fill-white opacity-10">
            <path d="M488.5,274.5Q401,299,401,350Q401,401,350.5,401.5Q300,402,261,359.5Q222,317,179,345Q136,373,113.5,350Q91,327,81.5,288.5Q72,250,54.5,211.5Q37,173,75,134.5Q113,96,152,74.5Q191,53,241.5,36Q292,19,335,54.5Q378,90,405,130.5Q432,171,489,210.5Q546,250,488.5,274.5Z" />
          </svg>
        </div>
        <div className="container mx-auto px-4 py-16 z-10">
          <div className="max-w-3xl">
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              Crowdfunding for People Who Care
            </h1>
            <p 
              className="text-xl text-white/90 mb-8 leading-relaxed"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="100"
            >
              FundHope connects you with causes that matter. Raise money for medical bills, education, community projects, and more.
            </p>
            <div 
              className="flex flex-wrap gap-4"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="200"
            >
              <Link 
                to="/discover" 
                className="bg-white text-purple-600 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
              >
                Discover Projects
              </Link>
              <Link 
                to="/create-campaign" 
                className="bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-purple-800 transition-colors"
              >
                Start a Campaign
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold dark:text-white" data-aos="fade-up">Featured Campaigns</h2>
            <Link 
              to="/discover" 
              className="text-purple-600 dark:text-purple-400 font-medium hover:underline"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              View all campaigns
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCampaigns.map((campaign, index) => (
                <div 
                  key={campaign._id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:translate-y-[-5px]"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <Link to={`/campaign/${campaign._id}`}>
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={campaign.image} 
                        alt={campaign.title} 
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  </Link>
                  <div className="p-6">
                    <div className="mb-2">
                      <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded">
                        {campaign.category}
                      </span>
                    </div>
                    <Link to={`/campaign/${campaign._id}`}>
                      <h3 className="text-xl font-bold mb-2 hover:text-purple-600 dark:text-white dark:hover:text-purple-400 transition-colors">
                        {campaign.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {campaign.shortDescription}
                    </p>
                    
                    {/* Progress bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(campaign.raised)}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          of {formatCurrency(campaign.goal)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${calculateProgress(campaign.raised, campaign.goal)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span>{calculateProgress(campaign.raised, campaign.goal)}% Funded</span>
                        <span>{getDaysLeft(campaign.endDate)} days left</span>
                      </div>
                    </div>
                    
                    <Link 
                      to={`/campaign/${campaign._id}`}
                      className="block text-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                    >
                      Support This Project
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 
              className="text-3xl font-bold mb-4 dark:text-white"
              data-aos="fade-up"
            >
              How FundHope Works
            </h2>
            <p 
              className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Starting or supporting a fundraiser has never been easier
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div 
              className="text-center"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">Create</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Start your fundraiser by telling your story and adding photos.
              </p>
            </div>
            
            <div 
              className="text-center"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">Share</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Share your campaign with friends, family, and social networks.
              </p>
            </div>
            
            <div 
              className="text-center"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">Collect</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Receive donations directly to your account with secure processing.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 
              className="text-3xl font-bold mb-4 dark:text-white"
              data-aos="fade-up"
            >
              Find Causes That Matter To You
            </h2>
            <p 
              className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Explore fundraisers in these popular categories
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { name: 'Medical', icon: '🏥', color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' },
              { name: 'Education', icon: '🎓', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
              { name: 'Emergency Relief', icon: '🆘', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' },
              { name: 'Animals', icon: '🐾', color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' },
              { name: 'Community', icon: '🏘️', color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' },
              { name: 'Creative', icon: '🎨', color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400' },
              { name: 'Business', icon: '💼', color: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400' },
              { name: 'Technology', icon: '💻', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
            ].map((category, index) => (
              <Link 
                key={category.name}
                to={`/discover?category=${category.name}`}
                className={`${category.color} p-6 rounded-lg text-center transition-transform hover:scale-105`}
                data-aos="fade-up"
                data-aos-delay={index * 50}
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <h3 className="font-semibold">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 
            className="text-3xl font-bold text-white mb-6"
            data-aos="fade-up"
          >
            Ready to Make a Difference?
          </h2>
          <p 
            className="text-xl text-white/90 mb-8 max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Join thousands of people who have successfully raised money for causes they care about.
          </p>
          <div
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <Link 
              to="/create-campaign" 
              className="bg-white text-purple-600 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
            >
              Start a Campaign Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

Home.propTypes = {
  // darkMode prop not used, so removed from PropTypes
};

export default Home;