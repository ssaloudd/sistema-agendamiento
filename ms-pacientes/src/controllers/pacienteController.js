// Esta capa maneja las peticiones HTTP (req, res).
// Recibe los datos, llama al servicio y responde al cliente.

const PacienteService = require('../services/pacienteService');

const PacienteController = {
    getPacientes: async (req, res) => {
        try {
            const pacientes = await PacienteService.obtenerTodos();
            res.status(200).json(pacientes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    crearPaciente: async (req, res) => {
        try {
            const paciente = await PacienteService.crearPaciente(req.body);
            res.status(201).json(paciente);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    actualizarPaciente: async (req, res) => {
        try {
            const { id } = req.params;
            const paciente = await PacienteService.actualizarPaciente(id, req.body);
            res.json(paciente);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    },

    eliminarPaciente: async (req, res) => {
        try {
            const { id } = req.params;
            const resultado = await PacienteService.eliminarPaciente(id);
            res.json(resultado);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    },

    recibirEvento: (req, res) => {
        const { tipo } = req.body;
        console.log(`Evento recibido en MS Pacientes: ${tipo}`);
        res.send({});
    }
};

module.exports = PacienteController;