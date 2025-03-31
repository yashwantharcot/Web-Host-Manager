import api from './api';

export const getAllWebsites = async () => {
  const response = await api.get('/websites');
  return response.data;
};

export const getWebsiteById = async (id) => {
  const response = await api.get(`/websites/${id}`);
  return response.data;
};

export const createWebsite = async (websiteData) => {
  const response = await api.post('/websites', websiteData);
  return response.data;
};

export const updateWebsite = async (id, websiteData) => {
  const response = await api.put(`/websites/${id}`, websiteData);
  return response.data;
};

export const deleteWebsite = async (id) => {
  await api.delete(`/websites/${id}`);
};

export default {
  getAllWebsites,
  getWebsiteById,
  createWebsite,
  updateWebsite,
  deleteWebsite
}; 