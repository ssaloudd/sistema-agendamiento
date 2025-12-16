const Notificacion = require('../models/notificacionModel');

const NotificacionRepository = {
    findAll: async () => {
        // Ordenamos por fecha descendente para ver las nuevas primero
        return await Notificacion.findAll({ order: [['fechaCreacion', 'DESC']] });
    },

    create: async (datos) => {
        return await Notificacion.create(datos);
    }
};

module.exports = NotificacionRepository;