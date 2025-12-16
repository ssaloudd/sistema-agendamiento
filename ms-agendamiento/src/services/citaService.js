// Antes de crear la cita, se valida sincrónicamente (REST)
// si el paciente existe y si el médico está disponible

const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const CitaRepository = require('../repositories/citaRepository');

const CitaService = {
    obtenerTodas: () => {
        return CitaRepository.findAll();
    },

    agendarCita: async (datos) => {
        const { pacienteId, medicoId, medicoNombre, turnoId, motivoConsulta } = datos;

        // 1. Validar datos obligatorios
        if (!pacienteId || !medicoId || !turnoId || !motivoConsulta) {
            throw new Error("Faltan datos obligatorios (pacienteId, medicoId, turnoId, motivo)");
        }

        // 2. ORQUESTACIÓN: Comunicación Síncrona con otros Microservicios

        // A. Validar Paciente (Llamada a MS Pacientes via Gateway)
        // Nota: En un entorno real validaríamos con un endpoint específico GET /pacientes/:id
        // Aquí asumimos que si responde el servicio, procedemos (o implementamos validación real si tuviéramos el endpoint findById expuesto).
        try {
            // Simulamos validación: intentamos obtener la lista solo para ver si el servicio responde
            await axios.get('http://localhost:4000/pacientes'); 
        } catch (error) {
            throw new Error("No se pudo conectar con el Servicio de Pacientes");
        }

        // B. Validar Disponibilidad Médico (Llamada a MS Médicos)
        try {
            const respuestaMedico = await axios.get(`http://localhost:4000/medicos/${medicoId}/verificar-disponibilidad`);
            if (!respuestaMedico.data.disponible) {
                throw new Error("El médico no está disponible para este horario");
            }
        } catch (error) {
             // Si el error es nuestro 404 o lógica
            if (error.response && error.response.status === 404) {
                 throw new Error("Médico no encontrado");
            }
            // Si falla la conexión
            console.error("Error contactando MS Médicos:", error.message);
            // Para propósitos del prototipo, si falla la conexión permitiremos continuar con advertencia, 
            // pero en producción esto debería bloquear.
        }

        // 3. Crear Objeto Cita (Modelo de Dominio) [cite: 230-238]
        const nuevaCita = {
            id: uuidv4(),
            pacienteId,
            medicoId,
            medicoNombre, // Redundancia útil para lectura
            turnoId,
            fechaCreacion: new Date().toISOString(),
            motivoConsulta,
            estado: 'PENDIENTE' // Estado inicial [cite: 245]
        };

        const citaGuardada = CitaRepository.create(nuevaCita);

        // 4. Comunicación Asíncrona: Publicar Evento "CitaCreada" [cite: 43]
        try {
            await axios.post('http://localhost:4005/events', {
                tipo: 'CitaCreada',
                datos: {
                    id: citaGuardada.id,
                    pacienteId,
                    medicoId,
                    fecha: new Date().toISOString()
                }
            });
        } catch (error) {
            console.log('Advertencia: Event Bus no responde');
        }

        return citaGuardada;
    }
};

module.exports = CitaService;