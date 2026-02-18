import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Important for CORS
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('API Request:', config.method?.toUpperCase(), config.url, config.headers);
  return config;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.method?.toUpperCase(), response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', error.config?.method?.toUpperCase(), error.config?.url, error.response?.status, error.message);
    console.error('Error details:', error.response?.data);
    
    // Handle specific errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => {
    const params = new URLSearchParams();
    params.append('username', credentials.username);
    params.append('password', credentials.password);
    return api.post('/api/auth/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },
  register: (userData) => api.post('/api/auth/register', userData),
  getProfile: () => api.get('/api/auth/me'),
};

export const productsAPI = {
  getProducts: () => {
    console.log('Fetching products from:', `${API_BASE_URL}/api/products/`);
    return api.get('/api/products/');
  },
  getProduct: (id) => api.get(`/api/products/${id}/`),
  createProduct: (data) => api.post('/api/products/', data),
  updateProduct: (id, data) => api.put(`/api/products/${id}/`, data),
  deleteProduct: (id) => api.delete(`/api/products/${id}/`),
  uploadImage: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/api/products/${id}/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export const ordersAPI = {
  getOrders: () => {
    console.log('Fetching orders from:', `${API_BASE_URL}/api/orders/`);
    return api.get('/api/orders/');
  },
  getOrder: (id) => api.get(`/api/orders/${id}/`),
  updateOrderStatus: (id, data) => api.put(`/api/orders/${id}/`, data),
};

export default api;
