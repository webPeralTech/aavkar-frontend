import axios from 'axios';
import { getToken } from '@/utils/auth';

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

export default instance;
