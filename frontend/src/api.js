import axios from 'axios';

// Create axios instance with base URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'https://fundhope.onrender.com';
// Base URL for the server (without /api)
export const BASE_URL = API_URL.replace(/\/api$/, '');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token in headers
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/users', userData),
  login: (email, password) => api.post('/users/login', { email, password }),
  getUserProfile: () => api.get('/users/profile'),
  updateUserProfile: (userData) => api.put('/users/profile', userData),
  forgotPassword: (email) => api.post('/users/forgot-password', { email }),
  resetPassword: (resetToken, password) => api.put(`/users/reset-password/${resetToken}`, { password }),
  verifyEmail: (verificationToken) => api.get(`/users/verify/${verificationToken}`),
};

// Campaign API
export const campaignAPI = {
  getCampaigns: (page = 1, keyword = '', category = '') => 
    api.get(`/campaigns?page=${page}&keyword=${keyword}&category=${category}`),
  getUserCampaigns: () => api.get('/campaigns/user'),
  getCampaignById: (id) => api.get(`/campaigns/${id}`),
  createCampaign: (campaignData) => {
    const formData = new FormData();
    
    // Append text fields
    Object.keys(campaignData).forEach((key) => {
      if (key !== 'image') {
        formData.append(key, campaignData[key]);
      }
    });
    
    // Append image file
    if (campaignData.image) {
      formData.append('image', campaignData.image);
    }
    
    return api.post('/campaigns', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  updateCampaign: (id, campaignData) => {
    const formData = new FormData();
    
    // Append text fields
    Object.keys(campaignData).forEach((key) => {
      if (key !== 'image') {
        formData.append(key, campaignData[key]);
      }
    });
    
    // Append image file if exists
    if (campaignData.image && typeof campaignData.image !== 'string') {
      formData.append('image', campaignData.image);
    }
    
    return api.put(`/campaigns/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteCampaign: (id) => api.delete(`/campaigns/${id}`),
  addCampaignUpdate: (id, updateData) => api.post(`/campaigns/${id}/updates`, updateData),
};

// Donation API
export const donationAPI = {
  createDonation: (donationData) => api.post('/donations', donationData),
  getUserDonations: () => api.get('/donations'),
  getDonationById: (id) => api.get(`/donations/${id}`),
  getCampaignDonations: (campaignId, page = 1) => 
    api.get(`/donations/campaign/${campaignId}?page=${page}`),
};

// Payment API
export const paymentAPI = {
  getPayPalConfig: () => api.get('/payments/paypal/config'),
  createPayPalOrder: (amount, campaignId) => 
    api.post('/payments/paypal/create-order', { amount, campaignId }),
  capturePayPalOrder: (orderId) => 
    api.post('/payments/paypal/capture-order', { orderId }),
};

export default {
  authAPI,
  campaignAPI,
  donationAPI,
  paymentAPI,
};
