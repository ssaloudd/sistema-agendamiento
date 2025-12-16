import api from './api';

const MedicoService = {
  getAll: async () => {
    // Recuerda: api.get('/medicos') pasa por el Gateway -> ms-medicos
    const response = await api.get('/medicos');
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/medicos', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/medicos/${id}`, data);
    return response.data;
  },

  remove: async (id) => {
    const response = await api.delete(`/medicos/${id}`);
    return response.data;
  }
};

export default MedicoService;