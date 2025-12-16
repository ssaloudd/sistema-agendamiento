import api from './api';

const PacienteService = {
  getAll: async () => {
    const response = await api.get('/pacientes');
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/pacientes', data);
    return response.data;
  },

  // Nuevo: Actualizar
  update: async (id, data) => {
    const response = await api.put(`/pacientes/${id}`, data);
    return response.data;
  },

  // Nuevo: Eliminar
  remove: async (id) => {
    const response = await api.delete(`/pacientes/${id}`);
    return response.data;
  }
};

export default PacienteService;