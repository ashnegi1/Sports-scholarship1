import axios from 'axios';

// Try multiple possible server URLs
const API_URLS = [
  'http://localhost:7777/api/auth',
  'http://127.0.0.1:7777/api/auth'
];

// Function to test which server is responding
async function findWorkingServer() {
  for (const url of API_URLS) {
    try {
      console.log(`Testing connection to: ${url}`);
      // Use a simple GET request with CORS mode set explicitly
      const response = await fetch(url.replace('/api/auth', '/health'), { 
        mode: 'cors',
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        timeout: 2000 
      });
      
      if (response.ok) {
        console.log(`Server at ${url} is responding!`);
        return url;
      } else {
        console.log(`Server at ${url} responded with status: ${response.status}`);
      }
    } catch (error) {
      console.log(`Server at ${url} is not responding: ${error.message}`);
    }
  }
  // Default to the first URL if none are working
  console.log('No servers responding, using default URL');
  return API_URLS[0];
}

// Initial API instance
const api = axios.create({
  baseURL: API_URLS[0],
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000, // 10 second timeout
  withCredentials: false // Changed to false for '*' origin CORS
});

// Check server connection on module load
(async () => {
  try {
    const workingUrl = await findWorkingServer();
    console.log(`Using API URL: ${workingUrl}`);
    api.defaults.baseURL = workingUrl;
  } catch (err) {
    console.error('Failed to find working server:', err);
  }
})();

// Add token to request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`Error response from ${error.config.url}:`, error.response.status, error.response.data);
    } else if (error.request) {
      console.error(`No response received from ${error.config.url}`);
      // Check if there might be a CORS error
      if (error.message && error.message.includes('NetworkError')) {
        console.error('Possible CORS issue detected');
      }
    } else {
      console.error(`Error setting up request to ${error.config?.url}:`, error.message);
    }
    return Promise.reject(error);
  }
);

// Register user
const register = async (userData) => {
  console.log('Registering user with data:', userData);
  
  try {
    console.log('Sending registration request');
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
    
    // Check for CORS errors
    if (error.message && (error.message.includes('NetworkError') || error.message.includes('Network Error'))) {
      return {
        success: false,
        error: 'CORS error: The server is not configured to accept requests from this origin. Please check server CORS settings.'
      };
    }
    
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
        error: 'No response from server. Please try again later or check if the server is running.'
      };
    }
    
    return {
      success: false,
      error: `Connection error: ${error.message}. Please check your network connection and server status.`
    };
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
    
    // Check for CORS errors
    if (error.message && (error.message.includes('NetworkError') || error.message.includes('Network Error'))) {
      return {
        success: false,
        error: 'CORS error: The server is not configured to accept requests from this origin. Please check server CORS settings.'
      };
    }
    
    if (error.response) {
      console.error("Server response:", error.response.data);
      console.error("Status code:", error.response.status);
      
      return {
        success: false,
        error: error.response?.data?.message || 'Invalid credentials. Please try again.'
      };
    } else if (error.request) {
      console.error("No response received");
      return {
        success: false,
        error: 'No response from server. Please check if the server is running at http://localhost:7777.'
      };
    }
    
    return {
      success: false,
      error: `Connection error: ${error.message}. Please check your network connection and server status.`
    };
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
    
    // Check for CORS errors
    if (error.message && (error.message.includes('NetworkError') || error.message.includes('Network Error'))) {
      return {
        success: false,
        error: 'CORS error: The server is not configured to accept requests from this origin. Please check server CORS settings.'
      };
    }
    
    if (error.response) {
      console.error("Server response:", error.response.data);
      console.error("Status code:", error.response.status);
      
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch user data'
      };
    } else if (error.request) {
      console.error("No response received");
      return {
        success: false,
        error: 'No response from server. Please try again later or check if the server is running.'
      };
    }
    
    return {
      success: false,
      error: `Connection error: ${error.message}. Please check your network connection and server status.`
    };
  }
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser
};

export default authService; 