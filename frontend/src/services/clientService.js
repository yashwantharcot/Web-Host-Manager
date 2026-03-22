import api from './api';

export const getAllClients = async () => {
  const response = await api.get('/clients');
  return response;
};

export const getClientById = async (id) => {
  const response = await api.get(`/clients/${id}`);
  return response;
};

export const createClient = async (clientData) => {
  const response = await api.post('/clients', clientData);
  return response;
};

export const updateClient = async (id, clientData) => {
  const response = await api.put(`/clients/${id}`, clientData);
  return response;
};

export const deleteClient = async (id) => {
  await api.delete(`/clients/${id}`);
};

export default {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient
}; 