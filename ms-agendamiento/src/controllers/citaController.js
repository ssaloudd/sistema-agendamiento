const CitaService = require('../services/citaService');

const CitaController = {
    getCitas: async (req, res) => {
        try {
            const citas = await CitaService.obtenerTodas();
            res.json(citas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    agendarCita: async (req, res) => {
        try {
            const cita = await CitaService.agendarCita(req.body);
            res.status(201).json(cita);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    anularCita: async (req, res) => {
        try {
            const { id } = req.params;
            const cita = await CitaService.anularCita(id);
            res.json(cita);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    },

    recibirEvento: (req, res) => {
        console.log(`Evento en Agendamiento: ${req.body.tipo}`);
        res.send({});
    }
};

module.exports = CitaController;