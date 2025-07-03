import axios from 'axios';

// API URL with port 7777 as specified in the backend config.js
const API_URL = 'http://localhost:7777/api/applications';

// Create axios instance with base config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Get all applications (admin only)
const getAllApplications = async () => {
  try {
    const response = await api.get('/');
    return response.data.data;
  } catch (error) {
    console.error("Get all applications error:", error.response?.data || error);
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch applications'
    );
  }
};

// Get user applications
const getUserApplications = async (userId) => {
  try {
    const response = await api.get(`/user/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error("Get user applications error:", error.response?.data || error);
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch your applications'
    );
  }
};

// Submit a new application
const submitApplication = async (applicationData) => {
  try {
    const response = await api.post('/', applicationData);
    return response.data;
  } catch (error) {
    console.error("Submit application error:", error.response?.data || error);
    throw new Error(
      error.response?.data?.message || 
      'Failed to submit application'
    );
  }
};

// Update application status (admin only)
const updateApplicationStatus = async (id, status, comments = '') => {
  try {
    const response = await api.put(`/${id}/status`, { status, comments });
    return response.data;
  } catch (error) {
    console.error("Update application status error:", error.response?.data || error);
    throw new Error(
      error.response?.data?.message || 
      'Failed to update application status'
    );
  }
};

// Get application by ID
const getApplicationById = async (id) => {
  try {
    const response = await api.get(`/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Get application by ID error:", error.response?.data || error);
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch application details'
    );
  }
};

const applicationService = {
  getAllApplications,
  getUserApplications,
  submitApplication,
  updateApplicationStatus,
  getApplicationById
};

export default applicationService; 