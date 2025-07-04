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

// Upload documents for an application
const uploadDocuments = async (applicationId, documents, documentType = 'supporting') => {
  try {
    // Debug information
    console.log(`Starting document upload for application: ${applicationId}`);
    console.log(`Document type: ${documentType}`);
    console.log(`Documents to upload:`, Array.isArray(documents) ? `${documents.length} files` : '1 file');
    
    // Get auth token directly
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    // Create form data for file upload - must use FormData for files
    const formData = new FormData();
    
    // Handle single file or array of files
    if (Array.isArray(documents)) {
      // Add multiple files to the same field name 'documents'
      documents.forEach((doc, index) => {
        console.log(`Appending file ${index + 1}/${documents.length}: ${doc.name}, size: ${doc.size} bytes, type: ${doc.type}`);
        formData.append('documents', doc);
      });
    } else if (documents instanceof File) {
      // Add single file
      console.log(`Appending single file: ${documents.name}, size: ${documents.size} bytes, type: ${documents.type}`);
      formData.append('documents', documents);
    } else {
      console.error('Invalid document format:', documents);
      throw new Error('Invalid document format');
    }
    
    // Add document type
    formData.append('documentType', documentType);
    
    // For debugging: log the FormData contents (note: can't directly log FormData contents)
    console.log('FormData created with documentType:', documentType);
    
    // Use fetch API instead of axios for better FormData support
    const url = `${API_URL}/${applicationId}/documents`;
    console.log(`Making request to: ${url}`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        // Don't set Content-Type with FormData, browser will set it with boundary
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    // Check if the response is ok
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`Server error ${response.status}: ${errorData.message || response.statusText}`);
      throw new Error(errorData.message || `Upload failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Upload successful, response:', data);
    return data;
  } catch (error) {
    console.error("Upload documents error:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    }
    throw new Error(error.message || 'Failed to upload documents');
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
  uploadDocuments,
  updateApplicationStatus,
  getApplicationById
};

export default applicationService; 