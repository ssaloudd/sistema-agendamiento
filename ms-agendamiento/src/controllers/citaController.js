const CitaService = require('../services/citaService');

const CitaController = {
    getCitas: (req, res) => {
        try {
            const citas = CitaService.obtenerTodas();
            res.json(citas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    agendarCita: async (req, res) => {
        try {
            const { pacienteId, medicoId, medicoNombre, turnoId, motivoConsulta } = req.body;
            
            const cita = await CitaService.agendarCita({
                pacienteId, 
                medicoId, 
                medicoNombre, 
                turnoId, 
                motivoConsulta
            });

            res.status(201).json(cita);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    recibirEvento: (req, res) => {
        // MS Agendamiento podría escuchar eventos como "MedicoDeshabilitado" para cancelar citas
        console.log(`Evento recibido en MS Agendamiento: ${req.body.tipo}`);
        res.send({});
    }
};

module.exports = CitaController;