// Un endpoint para recibir los eventos del Bus y otro (GET) para que
// el futuro Frontend pueda mostrar la "Bandeja de notificaciones"

const NotificacionService = require('../services/notificacionService');

const NotificacionController = {
    getNotificaciones: (req, res) => {
        const notificaciones = NotificacionService.obtenerTodas();
        res.json(notificaciones);
    },

    // Este es el Webhook que llama el Event Bus
    recibirEvento: async (req, res) => {
        try {
            const evento = req.body;
            // No esperamos a que termine el proceso para responder al Bus (Fire and Forget)
            NotificacionService.procesarEvento(evento);
            res.send({ status: 'Evento recibido' });
        } catch (error) {
            console.error("Error procesando evento:", error);
            res.status(500).send({ error: "Error interno" });
        }
    }
};

module.exports = NotificacionController;