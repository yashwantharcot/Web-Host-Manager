import api from './api';

export const getAllWebsites = async () => {
  const response = await api.get('/websites');
  return response;
};

export const getWebsiteById = async (id) => {
  const response = await api.get(`/websites/${id}`);
  return response;
};

export const createWebsite = async (websiteData) => {
  const response = await api.post('/websites', websiteData);
  return response;
};

export const updateWebsite = async (id, websiteData) => {
  const response = await api.put(`/websites/${id}`, websiteData);
  return response;
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