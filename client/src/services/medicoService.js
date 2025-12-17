import api from './api';

const MedicoService = {
  getAll: async () => {
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
  },

  // --- NUEVOS MÉTODOS PARA AGENDA ---
  
  // Consultar slots disponibles
  getTurnosDisponibles: async (id, fecha) => {
    // GET /medicos/:id/turnos?fecha=YYYY-MM-DD
    const response = await api.get(`/medicos/${id}/turnos?fecha=${fecha}`);
    return response.data;
  },

  // Generar slots (Simulación para el prototipo)
  generarAgenda: async (id, fecha) => {
    const response = await api.post(`/medicos/${id}/agenda`, { fecha });
    return response.data;
  },

  // Obtener detalle de un turno específico
  getTurnoById: async (id) => {
    const response = await api.get(`/turnos/${id}`); // Esto irá al Gateway -> ms-medicos
    return response.data;
  }
};

export default MedicoService;