// Un endpoint para recibir los eventos del Bus y otro (GET) para que
// el futuro Frontend pueda mostrar la "Bandeja de notificaciones"

const NotificacionService = require('../services/notificacionService');

const NotificacionController = {
    getNotificaciones: async (req, res) => {
        try {
            const lista = await NotificacionService.obtenerTodas();
            res.json(lista);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    recibirEvento: async (req, res) => {
        try {
            // "Fire and forget" para no bloquear al Bus, pero procesando
            NotificacionService.procesarEvento(req.body);
            res.send({ status: 'Procesando' });
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Error interno" });
        }
    }
};

module.exports = NotificacionController;