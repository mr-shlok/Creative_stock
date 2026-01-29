// API utility functions for Creative Stock
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const BASE_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error(`API call failed: ${endpoint}`, error);
    throw error;
  }
};

// Pin-related API functions
export const pinApi = {
  // Get all pins with optional filtering
  getPins: (params = {}) => {
    const queryParams = new URLSearchParams(params);
    return apiCall(`/pins${queryParams.toString() ? `?${queryParams}` : ''}`);
  },

  // Get a specific pin by ID
  getPin: (id) => {
    return apiCall(`/pins/${id}`);
  },

  // Create a new pin
  createPin: (pinData) => {
    return apiCall('/pins', {
      method: 'POST',
      body: JSON.stringify(pinData),
    });
  },

  // Update an existing pin
  updatePin: (id, pinData) => {
    return apiCall(`/pins/${id}`, {
      method: 'PUT',
      body: JSON.stringify(pinData),
    });
  },

  // Delete a pin
  deletePin: (id) => {
    return apiCall(`/pins/${id}`, {
      method: 'DELETE',
    });
  },
};

// Category-related API functions
export const categoryApi = {
  // Get all categories
  getCategories: () => {
    return apiCall('/categories');
  },

  // Create a new category
  createCategory: (categoryData) => {
    return apiCall('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },
};

// Admin-related API functions
export const adminApi = {
  // Admin login
  login: (credentials) => {
    return apiCall('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
};

// File upload API function; returns full image URL for pin.image
export const uploadApi = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    let response;
    try {
      response = await fetch(`${BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });
    } catch (err) {
      throw new Error('Network error: cannot reach server. Is the backend running on ' + BASE_URL + '?');
    }
    
    let data = {};
    try {
      const text = await response.text();
      data = text ? JSON.parse(text) : {};
    } catch (_) {
      throw new Error(response.ok ? 'Invalid response from server' : 'Upload failed');
    }
    
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Upload failed');
    }
    
    const fullUrl = data.url?.startsWith('http') ? data.url : `${BASE_URL}${data.url}`;
    const fullOriginalUrl = data.originalUrl ? (data.originalUrl.startsWith('http') ? data.originalUrl : `${BASE_URL}${data.originalUrl}`) : null;
    return { ...data, url: fullUrl, originalUrl: fullOriginalUrl };
  }
};

export default apiCall;