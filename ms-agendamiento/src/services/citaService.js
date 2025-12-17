// Antes de crear la cita, se valida sincrónicamente (REST)
// si el paciente existe y si el médico está disponible

const axios = require('axios');
const CitaRepository = require('../repositories/citaRepository');

// Variables de entorno
const GATEWAY = process.env.GATEWAY_URL || 'http://localhost:4000';
const EVENT_BUS = process.env.EVENT_BUS_URL || 'http://localhost:4005';

const CitaService = {
    obtenerTodas: async () => {
        return await CitaRepository.findAll();
    },

    agendarCita: async (datos) => {
        const { pacienteId, medicoId, medicoNombre, turnoId, motivoConsulta, fechaCita } = datos;

        if (!pacienteId || !medicoId || !turnoId || !motivoConsulta || !fechaCita) {
            throw new Error("Faltan datos obligatorios");
        }

        // 1. ORQUESTACIÓN: Validaciones Externas
        try {
            // Validar Paciente
            await axios.get(`${GATEWAY}/pacientes`); 
            
            // Validar Disponibilidad Médico
            const respMedico = await axios.get(`${GATEWAY}/medicos/${medicoId}/verificar-disponibilidad`);
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
            fechaCita,
            estado: 'PENDIENTE'
        });

        // 3. Evento
        try {
            await axios.post(`${EVENT_BUS}/events`, {
                tipo: 'CitaCreada',
                datos: {
                    id: nuevaCita.id,
                    pacienteId,
                    medicoId,
                    turnoId: turnoId,
                    fecha: new Date().toISOString()
                }
            });
            console.log("Evento CitaCreada enviado con turnoId:", turnoId); // Log para depurar
        } catch (error) { 
            console.log('Bus no responde'); 
        }

        return nuevaCita;
    },

    anularCita: async (id) => {
        const cita = await CitaRepository.updateEstado(id, 'ANULADA');
        if (!cita) throw new Error("Cita no encontrada");

        // Evento de Anulación
        try {
             await axios.post(`${EVENT_BUS}/events`, {
                tipo: 'CitaAnulada',
                datos: { id: cita.id }
            });
        } catch (e) {}

        return cita;
    },

    reprogramarCita: async (id, nuevosDatos) => {
        const { nuevoTurnoId, nuevaFecha } = nuevosDatos;
        const cita = await CitaRepository.findById(id);
        if (!cita) throw new Error("Cita no encontrada");

        // 1. Lógica de Negocio: Validar que no sea la misma
        if (cita.turnoId === nuevoTurnoId) throw new Error("El nuevo turno es igual al actual");

        // 2. ORQUESTACIÓN (Crucial):
        // A. Liberar turno anterior (Llamada a MS Médicos via Evento o REST)
        // Por simplicidad y consistencia, emitiremos evento de "CitaReprogramada" 
        // y dejaremos que MS Médicos maneje los cambios de estado de los turnos.
        
        // Actualizamos datos locales
        const turnoAnteriorId = cita.turnoId;
        cita.turnoId = nuevoTurnoId;
        cita.fechaCita = nuevaFecha;
        cita.estado = 'PENDIENTE'; // Vuelve a pendiente o confirmada
        await cita.save();

        // 3. Emitir Evento Complejo
        try {
            await axios.post('http://localhost:4005/events', {
                tipo: 'CitaReprogramada',
                datos: {
                    citaId: cita.id,
                    turnoAnteriorId: turnoAnteriorId,
                    turnoNuevoId: nuevoTurnoId,
                    pacienteId: cita.pacienteId
                }
            });
        } catch (e) { console.log('Error Bus'); }

        return cita;
    },
};

module.exports = CitaService;