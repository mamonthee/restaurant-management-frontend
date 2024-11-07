// src/services/axios.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://13.51.198.170:9000', // Set the base URL here
//   baseURL: 'http://localhost:9000', // Set the base URL here
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add interceptors to handle request and response globally
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

apiClient.interceptors.response.use(response => {
    return response;
}, error => {
    // Global error handling
    return Promise.reject(error);
});

export default apiClient;
