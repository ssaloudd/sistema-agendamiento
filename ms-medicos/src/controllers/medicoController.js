// Maneja las peticiones HTTP y extrae los datos del cuerpo de la petición

const MedicoService = require('../services/medicoService');

const MedicoController = {
    getMedicos: async (req, res) => {
        try {
            const medicos = await MedicoService.obtenerTodos();
            res.json(medicos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    crearMedico: async (req, res) => {
        try {
            const medico = await MedicoService.crearMedico(req.body);
            res.status(201).json(medico);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    actualizarMedico: async (req, res) => {
        try {
            const { id } = req.params;
            const medico = await MedicoService.actualizarMedico(id, req.body);
            res.json(medico);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    },

    eliminarMedico: async (req, res) => {
        try {
            const { id } = req.params;
            const resultado = await MedicoService.eliminarMedico(id);
            res.json(resultado);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    },

    verificarDisponibilidad: async (req, res) => {
        const { id } = req.params;
        const disponible = await MedicoService.verificarDisponibilidad(id);
        res.json({ disponible });
    },

    recibirEvento: (req, res) => {
        console.log(`Evento en MS Medicos: ${req.body.tipo}`);
        res.send({});
    }
};

module.exports = MedicoController;