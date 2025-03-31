import api from './api';

const emailService = {
  getAllEmails: async () => {
    const response = await api.get('/api/emails');
    return response.data;
  },

  getEmailById: async (id) => {
    const response = await api.get(`/api/emails/${id}`);
    return response.data;
  },

  createEmail: async (emailData) => {
    const response = await api.post('/api/emails', emailData);
    return response.data;
  },

  updateEmail: async (id, emailData) => {
    const response = await api.put(`/api/emails/${id}`, emailData);
    return response.data;
  },

  deleteEmail: async (id) => {
    const response = await api.delete(`/api/emails/${id}`);
    return response.data;
  },

  getEmailsByClient: async (clientId) => {
    const response = await api.get(`/api/clients/${clientId}/emails`);
    return response.data;
  },

  getEmailsByWebsite: async (websiteId) => {
    const response = await api.get(`/api/websites/${websiteId}/emails`);
    return response.data;
  }
};

export default emailService; 