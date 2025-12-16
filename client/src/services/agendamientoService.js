import api from './api';

const AgendamientoService = {
  getAll: async () => {
    const response = await api.get('/agendamiento');
    return response.data;
  },

  create: async (data) => {
    // data debe incluir: pacienteId, medicoId, medicoNombre, turnoId, motivoConsulta
    const response = await api.post('/agendamiento', data);
    return response.data;
  },

  anular: async (id) => {
    const response = await api.put(`/agendamiento/${id}/anular`);
    return response.data;
  }
};

export default AgendamientoService;