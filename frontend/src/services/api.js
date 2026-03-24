import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    // Automatically unwrap the standard backend response structure: { status: 'success', data: { ... } }
    if (response.data && response.data.status === 'success' && response.data.data) {
      const data = response.data.data;
      // If data has only one key and it's an array or object, return that value
      const keys = Object.keys(data);
      if (keys.length === 1) {
        return data[keys[0]];
      }
      return data;
    }
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: async () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  isAdmin: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return false;
    try {
      const user = JSON.parse(userStr);
      return user.role === 'admin';
    } catch (e) {
      return false;
    }
  },
};

// Client Service
export const clientService = {
  getAllClients: () => api.get('/clients'),
  getClient: (id) => api.get(`/clients/${id}`),
  createClient: (data) => api.post('/clients', data),
  updateClient: (id, data) => api.put(`/clients/${id}`, data),
  deleteClient: (id) => api.delete(`/clients/${id}`),
};

// Website Service
export const websiteService = {
  getAllWebsites: () => api.get('/websites'),
  getWebsite: (id) => api.get(`/websites/${id}`),
  createWebsite: (data) => api.post('/websites', data),
  updateWebsite: (id, data) => api.put(`/websites/${id}`, data),
  deleteWebsite: (id) => api.delete(`/websites/${id}`),
  getWebsitesByClient: (clientId) => api.get(`/clients/${clientId}/websites`),
};

// Domain Service
export const domainService = {
  getAllDomains: () => api.get('/domains'),
  getDomain: (id) => api.get(`/domains/${id}`),
  createDomain: (data) => api.post('/domains', data),
  updateDomain: (id, data) => api.put(`/domains/${id}`, data),
  deleteDomain: (id) => api.delete(`/domains/${id}`),
  getDomainsByClient: (clientId) => api.get(`/domains/client/${clientId}`),
};

// Email Service
export const emailService = {
  getAllEmails: () => api.get('/emails'),
  getEmail: (id) => api.get(`/emails/${id}`),
  createEmail: (data) => api.post('/emails', data),
  updateEmail: (id, data) => api.put(`/emails/${id}`, data),
  deleteEmail: (id) => api.delete(`/emails/${id}`),
  getEmailsByClient: (clientId) => api.get(`/clients/${clientId}/emails`),
  sendNotification: (data) => api.post('/email/notify', data),
};

// Settings Service
export const settingsService = {
  getSettings: () => api.get('/settings'),
  updateSettings: (data) => api.put('/settings', data),
};

export default api;