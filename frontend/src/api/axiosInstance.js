import axios from 'axios';

const apiBaseUrl = (process.env.REACT_APP_API_URL || 'http://localhost:7001/api').replace(/\/+$/, '');
const assetBaseUrl = apiBaseUrl.replace(/\/api$/i, '');

const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use((response) => {
  return response;
}, (error) => {
  console.error('API Error:', error.response || error);
  return Promise.reject(error);
});

export const getAssetUrl = (path) => path ? `${assetBaseUrl}${path}` : '';

export default axiosInstance;