import api from './api';

const NotificacionService = {
  getAll: async () => {
    const response = await api.get('/notificaciones');
    return response.data;
  }
};

export default NotificacionService;