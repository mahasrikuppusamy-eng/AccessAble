import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: automatically append token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessable_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401s gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      // Only remove if it was an authenticated request error
      if (localStorage.getItem('accessable_token')) {
        console.warn('Session expired or unauthorized. Logging out.');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
