const notificacionesDB = [];

const NotificacionRepository = {
    findAll: () => notificacionesDB,
    
    create: (notificacion) => {
        notificacionesDB.push(notificacion);
        return notificacion;
    }
};

module.exports = NotificacionRepository;