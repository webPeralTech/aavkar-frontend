import axios from 'axios';
import { getToken } from '@/utils/auth';
import { handleInvalidAuth } from '@/libs/handleInvalidAuth';

const instance = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:5000/api', // Set your API base URL here
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle invalid/expired tokens
instance.interceptors.response.use(
  response => response,
  error => {
    // Check for 401 Unauthorized or invalid token error
    if (
      error.response &&
      (error.response.status === 401 ||
        (typeof error.response.data?.message === 'string' &&
          error.response.data.message.toLowerCase().includes('token')))
    ) {
      handleInvalidAuth();
    }
    return Promise.reject(error);
  }
);

export default instance;
