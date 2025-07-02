import axios from 'axios';

const API_URL = 'http://localhost:7777/api/auth';

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

// Register user
const register = async (userData) => {
  console.log('Registering user with data:', userData);
  
  try {
    console.log('Sending registration request to:', `${API_URL}/register`);
    const response = await api.post('/register', userData);
    console.log('Registration response:', response.data);
    
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('auth_user', JSON.stringify(response.data.user));
      console.log('User data saved to localStorage');
    }

    return {
      ...response.data,
      success: response.data.success || true
    };
  } catch (error) {
    console.error("Registration error details:", error);
    if (error.response) {
      console.error("Server response:", error.response.data);
      console.error("Status code:", error.response.status);
      
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed. Please try again.'
      };
    } else if (error.request) {
      console.error("No response received:", error.request);
      return {
        success: false,
        error: 'No response from server. Please try again later.'
      };
    }
    
    throw new Error(
      error.response?.data?.message || 
      'Registration failed. Please try again.'
    );
  }
};

// Login user
const login = async (email, password) => {
  console.log('Attempting login for:', email);
  
  try {
    const response = await api.post('/login', { email, password });
    console.log('Login response:', response.data);
    
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('auth_user', JSON.stringify(response.data.user));
      console.log('User logged in successfully');
    }

    return {
      ...response.data,
      success: response.data.success || true
    };
  } catch (error) {
    console.error("Login error details:", error);
    if (error.response) {
      console.error("Server response:", error.response.data);
      console.error("Status code:", error.response.status);
      
      return {
        success: false,
        error: error.response?.data?.message || 'Invalid credentials. Please try again.'
      };
    }
    
    throw new Error(
      error.response?.data?.message || 
      'Invalid credentials. Please try again.'
    );
  }
};

// Logout user
const logout = () => {
  console.log('Logging out user');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
};

// Get current user
const getCurrentUser = async () => {
  console.log('Fetching current user data');
  
  try {
    const response = await api.get('/me');
    console.log('Current user data:', response.data);
    return {
      ...response.data,
      success: response.data.success || true
    };
  } catch (error) {
    console.error("Get current user error details:", error);
    if (error.response) {
      console.error("Server response:", error.response.data);
      console.error("Status code:", error.response.status);
      
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch user data'
      };
    }
    
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch user data'
    );
  }
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser
};

export default authService; 