import api from './api';

const emailService = {
  getAllEmails: async () => {
    const response = await api.get('/emails');
    return response;
  },

  getEmailById: async (id) => {
    const response = await api.get(`/emails/${id}`);
    return response;
  },

  createEmail: async (emailData) => {
    const response = await api.post('/emails', emailData);
    return response;
  },

  updateEmail: async (id, emailData) => {
    const response = await api.put(`/emails/${id}`, emailData);
    return response;
  },

  deleteEmail: async (id) => {
    const response = await api.delete(`/emails/${id}`);
    return response;
  },

  getEmailsByClient: async (clientId) => {
    const response = await api.get(`/clients/${clientId}/emails`);
    return response;
  },

  getEmailsByWebsite: async (websiteId) => {
    const response = await api.get(`/websites/${websiteId}/emails`);
    return response;
  }
};

export default emailService; 