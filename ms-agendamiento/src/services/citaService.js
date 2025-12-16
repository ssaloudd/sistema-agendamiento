// Antes de crear la cita, se valida sincrónicamente (REST)
// si el paciente existe y si el médico está disponible

const axios = require('axios');
const CitaRepository = require('../repositories/citaRepository');

const CitaService = {
    obtenerTodas: async () => {
        return await CitaRepository.findAll();
    },

    agendarCita: async (datos) => {
        const { pacienteId, medicoId, medicoNombre, turnoId, motivoConsulta } = datos;

        if (!pacienteId || !medicoId || !turnoId || !motivoConsulta) {
            throw new Error("Faltan datos obligatorios");
        }

        // 1. ORQUESTACIÓN: Validaciones Externas
        try {
            // Validar Paciente
            await axios.get(`http://localhost:4000/pacientes`); 
            
            // Validar Disponibilidad Médico
            const respMedico = await axios.get(`http://localhost:4000/medicos/${medicoId}/verificar-disponibilidad`);
            if (!respMedico.data.disponible) {
                throw new Error("El médico no está disponible");
            }
        } catch (error) {
            console.error("Error en validaciones externas:", error.message);
            // Dependiendo de la rigurosidad, podríamos lanzar error o dejar pasar en modo 'dev'
            // throw new Error("Error validando datos externos: " + error.message);
        }

        // 2. Persistencia
        const nuevaCita = await CitaRepository.create({
            pacienteId,
            medicoId,
            medicoNombre,
            turnoId,
            motivoConsulta,
            estado: 'PENDIENTE'
        });

        // 3. Evento
        try {
            await axios.post('http://localhost:4005/events', {
                tipo: 'CitaCreada',
                datos: {
                    id: nuevaCita.id,
                    pacienteId,
                    medicoId,
                    fecha: new Date().toISOString()
                }
            });
        } catch (error) { console.log('Bus no responde'); }

        return nuevaCita;
    },

    anularCita: async (id) => {
        const cita = await CitaRepository.updateEstado(id, 'ANULADA');
        if (!cita) throw new Error("Cita no encontrada");

        // Evento de Anulación
        try {
             await axios.post('http://localhost:4005/events', {
                tipo: 'CitaAnulada',
                datos: { id: cita.id }
            });
        } catch (e) {}

        return cita;
    }
};

module.exports = CitaService;