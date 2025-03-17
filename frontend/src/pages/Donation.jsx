import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DonationModal from '../components/DonationModal';
import ConfettiSuccess from '../components/ConfettiSuccess';
import DonationError from '../components/DonationError';
import { campaignAPI, BASE_URL } from '../api';

// We'll replace this with real data from the API
const featuredProjects = [
  {
    id: '6500a1b26dfcb7be6246adb1', // Using a proper MongoDB ObjectId format
    title: 'Clean Water Initiative',
    description: 'Providing clean drinking water to communities in need through sustainable solutions.',
    image: 'https://images.unsplash.com/photo-1578496479531-42cc0772c430?q=80&w=2070',
    raised: 15000,
    goal: 25000
  },
  {
    id: '6500a1b26dfcb7be6246adb2', // Using a proper MongoDB ObjectId format
    title: 'Education for All',
    description: 'Supporting education for underprivileged children with books, supplies, and infrastructure.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022',
    raised: 24000,
    goal: 35000
  },
  {
    id: '6500a1b26dfcb7be6246adb3', // Using a proper MongoDB ObjectId format
    title: 'Community Garden Project',
    description: 'Creating sustainable community gardens to provide fresh produce and education.',
    image: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?q=80&w=1974',
    raised: 32000,
    goal: 40000
  }
];

const DonatePage = () => {
  const { projectId } = useParams();
  const [allProjects, setAllProjects] = useState(featuredProjects);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Fetch real campaign data
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const { data } = await campaignAPI.getCampaigns(1, '', '');
        
        if (data && data.campaigns && data.campaigns.length > 0) {
          // Transform the data to match our expected format
          const transformedCampaigns = data.campaigns.map(campaign => ({
            id: campaign._id,
            title: campaign.title,
            description: campaign.shortDescription,
            image: campaign.image && !campaign.image.startsWith('http') 
              ? `${BASE_URL}/${campaign.image}` 
              : campaign.image,
            raised: campaign.raised,
            goal: campaign.goal
          }));
          
          setAllProjects(transformedCampaigns);
          
          // If projectId was provided, find that project
          if (projectId) {
            const project = transformedCampaigns.find(p => p.id === projectId);
            if (project) {
              setSelectedProject(project);
              setIsDonationModalOpen(true);
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch campaigns:', err);
        // Fall back to mock data
        if (projectId) {
          const project = featuredProjects.find(p => p.id === projectId);
          setSelectedProject(project || featuredProjects[0]);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchCampaigns();
  }, [projectId]);
  
  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setIsDonationModalOpen(true);
  };
  
  const handleDonationSuccess = () => {
    setIsDonationModalOpen(false);
    setIsSuccessVisible(true);
  };
  
  const handleDonationFailure = (message) => {
    setIsDonationModalOpen(false);
    setErrorMessage(message);
    setIsErrorVisible(true);
  };
  
  const handleRetry = () => {
    setIsErrorVisible(false);
    setIsDonationModalOpen(true);
  };
  
  // Calculate progress percentage
  const calculateProgress = (raised, goal) => {
    return Math.min(Math.round((raised / goal) * 100), 100);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Make a Difference Today</h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Your donation can change lives and bring hope to communities around the world.
          </p>
          <button 
            onClick={() => window.scrollTo({ top: document.getElementById('projects')?.offsetTop || 0, behavior: 'smooth' })}
            className="bg-white text-purple-600 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
          >
            Explore Projects
          </button>
        </div>
      </section>
      
      {/* Featured Projects Section */}
      <section id="projects" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 dark:text-white">Featured Projects</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-12 max-w-3xl mx-auto">
            Choose a project to support or make a general donation to our organization
          </p>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allProjects.map(project => (
                <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:translate-y-[-5px]">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 dark:text-white">{project.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{project.description}</p>
                    
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-purple-600 dark:text-purple-400">
                        ${project.raised.toLocaleString()}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        Goal: ${project.goal.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${calculateProgress(project.raised, project.goal)}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-6">
                      <span>{calculateProgress(project.raised, project.goal)}% Funded</span>
                    </div>
                    
                    <button 
                      onClick={() => handleProjectSelect(project)}
                      className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors font-medium"
                    >
                      Donate Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Donation Modal */}
      {selectedProject && (
        <DonationModal
          isOpen={isDonationModalOpen}
          onClose={() => setIsDonationModalOpen(false)}
          project={selectedProject}
          onDonationSuccess={handleDonationSuccess}
          onDonationFailure={handleDonationFailure}
        />
      )}
      
      {/* Success Animation */}
      <ConfettiSuccess
        isActive={isSuccessVisible}
        message={`Thank you for your donation${selectedProject ? ` to ${selectedProject.title}` : ''}! Your contribution will help make a difference.`}
        onComplete={() => setIsSuccessVisible(false)}
      />
      
      {/* Error Modal */}
      <DonationError
        isVisible={isErrorVisible}
        message={errorMessage}
        onClose={() => setIsErrorVisible(false)}
        onRetry={handleRetry}
      />
    </div>
  );
};

export default DonatePage;