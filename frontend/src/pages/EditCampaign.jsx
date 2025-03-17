import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { campaignAPI, BASE_URL } from '../api';

const categories = [
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

const EditCampaign = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    category: '',
    goal: '',
    endDate: '',
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [hasImageChanged, setHasImageChanged] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true);
        const { data } = await campaignAPI.getCampaignById(id);
        
        // Format the date to YYYY-MM-DD for input[type="date"]
        const endDate = new Date(data.endDate);
        const formattedDate = endDate.toISOString().split('T')[0];
        
        setFormData({
          title: data.title || '',
          shortDescription: data.shortDescription || '',
          description: data.description || '',
          category: data.category || '',
          goal: data.goal || '',
          endDate: formattedDate || '',
        });
        
        // Ensure image URL is absolute
        if (data.image && !data.image.startsWith('http')) {
          setImagePreview(`${BASE_URL}/${data.image}`);
        } else {
          setImagePreview(data.image);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching campaign:', err);
        setError('Failed to load campaign data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'goal') {
      // Only allow numbers for goal
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData(prev => ({ ...prev, image: file }));
    setHasImageChanged(true);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    if (!formData.title) return 'Title is required';
    if (!formData.shortDescription) return 'Short description is required';
    if (!formData.description) return 'Full description is required';
    if (!formData.category) return 'Category is required';
    if (!formData.goal) return 'Fundraising goal is required';
    if (Number(formData.goal) <= 0) return 'Fundraising goal must be greater than zero';
    if (!formData.endDate) return 'End date is required';
    
    const endDate = new Date(formData.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (endDate < today) return 'End date must be in the future';
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      console.log('Updating campaign with ID:', id);
      
      // Create a data object for the API
      const campaignData = { ...formData };
      
      // Only include the image if it has changed
      if (!hasImageChanged) {
        delete campaignData.image;
      }
      
      // Convert goal to number
      campaignData.goal = Number(campaignData.goal);
      
      console.log('Campaign data to be sent:', campaignData);
      
      const response = await campaignAPI.updateCampaign(id, campaignData);
      console.log('Update campaign response:', response);
      
      setSuccess(true);
      
      // Refresh the campaign data to show the updates
      const { data: refreshedData } = await campaignAPI.getCampaignById(id);
      console.log('Campaign data after update:', refreshedData);
      
      // Redirect to campaign page after successful update
      setTimeout(() => {
        navigate(`/campaign/${id}`);
      }, 2000);
    } catch (err) {
      console.error('Error updating campaign:', err);
      setError(err.response?.data?.message || 'Failed to update campaign. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Edit Campaign</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Campaign updated successfully! Redirecting...
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Campaign Title*
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Give your campaign a clear, descriptive title"
              />
            </div>
            
            <div>
              <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Short Description*
              </label>
              <input
                type="text"
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Brief summary (appears in campaign cards)"
                maxLength={100}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {formData.shortDescription.length}/100 characters
              </p>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Description*
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-2 border rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Detailed description of your campaign"
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category*
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="goal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fundraising Goal*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400">$</span>
                </div>
                <input
                  type="text"
                  id="goal"
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                  className="w-full pl-8 px-4 py-2 border rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="Amount needed"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date*
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Campaign Image
              </label>
              {imagePreview && (
                <div className="mb-3">
                  <img 
                    src={imagePreview} 
                    alt="Campaign preview" 
                    className="h-48 w-full object-cover rounded-md"
                  />
                </div>
              )}
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
                className="w-full px-4 py-2 border rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Only upload a new image if you want to change the current one
              </p>
            </div>
          </div>
          
          <div className="flex justify-end mt-8 space-x-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCampaign; 