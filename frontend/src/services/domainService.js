import api from './api';

export const getAllDomains = async () => {
  const response = await api.get('/domains');
  return response;
};

export const getDomainById = async (id) => {
  const response = await api.get(`/domains/${id}`);
  return response;
};

export const createDomain = async (domainData) => {
  const response = await api.post('/domains', domainData);
  return response;
};

export const updateDomain = async (id, domainData) => {
  const response = await api.put(`/domains/${id}`, domainData);
  return response;
};

export const deleteDomain = async (id) => {
  await api.delete(`/domains/${id}`);
};

export const getDomainsByClient = async (clientId) => {
  const response = await api.get(`/domains/client/${clientId}`);
  return response;
};

export const getDomainsByWebsite = async (websiteId) => {
  const response = await api.get(`/domains/website/${websiteId}`);
  return response;
};

export default {
  getAllDomains,
  getDomainById,
  createDomain,
  updateDomain,
  deleteDomain,
  getDomainsByClient,
  getDomainsByWebsite
}; 