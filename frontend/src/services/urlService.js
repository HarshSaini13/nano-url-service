import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Shorten a URL
 * @param {string} originalUrl - The original URL to shorten
 * @returns {Promise} - Promise with the response data
 */
export const shortenUrl = async (originalUrl) => {
  return await api.post('/url', { originalUrl });
};

/**
 * Get URL statistics
 * @param {string} shortId - The short ID to get statistics for
 * @returns {Promise} - Promise with the response data
 */
export const getUrlStats = async (shortId) => {
  return await api.get(`/url/${shortId}/stats`);
};

// Add request interceptor for handling errors globally
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for handling errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
    }

    // Log errors for debugging
    console.error('API Error:', error);

    return Promise.reject(error);
  }
);

export default api;
