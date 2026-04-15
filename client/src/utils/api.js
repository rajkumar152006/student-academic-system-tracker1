import axios from 'axios';

// Create an axios instance with the base URL pointing to the backend server
const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
