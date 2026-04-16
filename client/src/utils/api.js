import axios from 'axios';

// Create an axios instance with the base URL pointing to the backend server
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

export default api;
