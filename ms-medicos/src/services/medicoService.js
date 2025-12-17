const axios = require('axios');
const MedicoRepository = require('../repositories/medicoRepository');
const TurnoRepository = require('../repositories/turnoRepository');
const { v4: uuidv4 } = require('uuid');

const MedicoService = {
    obtenerTodos: async () => {
        return await MedicoRepository.findAll();
    },

    crearMedico: async (datos) => {
        const { 
            cedula, nombres, apellidos, genero, fechaNacimiento, 
            estadoCivil, telefono, email, direccion, numeroLicencia 
        } = datos;

        if (!cedula || !nombres || !apellidos || !email || !numeroLicencia) {
            throw new Error("Faltan datos obligatorios (incluyendo número de licencia)");
        }

        const existe = await MedicoRepository.findByCedula(cedula);
        if (existe) {
            throw new Error("Ya existe un médico con esa cédula");
        }

        const medicoCreado = await MedicoRepository.create({
            cedula, nombres, apellidos, genero, fechaNacimiento,
            estadoCivil, telefono, email, direccion, numeroLicencia
        });

        // Evento al Bus
        try {
            await axios.post('http://localhost:4005/events', {
                tipo: 'MedicoCreado',
                datos: {
                    id: medicoCreado.id,
                    nombreCompleto: `${nombres} ${apellidos}`
                }
            });
        } catch (error) {
            console.log('Advertencia: Event Bus no responde');
        }

        return medicoCreado;
    },

    actualizarMedico: async (id, datos) => {
        const actualizado = await MedicoRepository.update(id, datos);
        if (!actualizado) throw new Error("Médico no encontrado");
        return actualizado;
    },

    eliminarMedico: async (id) => {
        // Podríamos implementar "deshabilitar" cambiando activo: false, 
        // pero para el CRUD completo usaremos borrado físico.
        const eliminado = await MedicoRepository.delete(id);
        if (!eliminado) throw new Error("Médico no encontrado");
        return { message: "Médico eliminado" };
    },

    verificarDisponibilidad: async (medicoId) => {
        const medico = await MedicoRepository.findById(medicoId);
        // Lógica simple: si existe y está activo, está disponible
        return !!(medico && medico.activo);
    },

    // NUEVO: Generar slots de 30 min para una fecha dada (Simulación de Horario)
    generarAgendaDiaria: async (medicoId, fecha) => {
        // En un sistema real, leeríamos la tabla 'HorarioMedico'.
        // Aquí simularemos que el médico trabaja de 09:00 a 13:00
        const horaInicio = 9; // 9 AM
        const horaFin = 13;   // 1 PM
        const duracionMinutos = 30;

        const turnosGenerados = [];
        let horaActual = horaInicio * 60; // Minutos desde las 00:00
        const horaLimite = horaFin * 60;

        while (horaActual < horaLimite) {
            // Convertir minutos a formato HH:MM
            const h = Math.floor(horaActual / 60).toString().padStart(2, '0');
            const m = (horaActual % 60).toString().padStart(2, '0');
            const startStr = `${h}:${m}`; // Ej: "09:00"

            const finMinutos = horaActual + duracionMinutos;
            const hF = Math.floor(finMinutos / 60).toString().padStart(2, '0');
            const mF = (finMinutos % 60).toString().padStart(2, '0');
            const endStr = `${hF}:${mF}`; // Ej: "09:30"

            turnosGenerados.push({
                id: uuidv4(),
                medicoId,
                fecha,
                horaInicio: startStr,
                horaFin: endStr,
                estado: 'DISPONIBLE'
            });

            horaActual += duracionMinutos;
        }

        return await TurnoRepository.createBulk(turnosGenerados);
    },

    // NUEVO: Obtener turnos disponibles
    obtenerTurnosDisponibles: async (medicoId, fecha) => {
        return await TurnoRepository.findByMedicoAndFecha(medicoId, fecha);
    },

    obtenerTurnoPorId: async (id) => {
        return await TurnoRepository.findById(id);
    },

    // NUEVO: Reservar turno (llamado cuando se crea cita)
    ocuparTurno: async (turnoId) => {
        return await TurnoRepository.actualizarEstado(turnoId, 'OCUPADO');
    },
    
    // NUEVO: Liberar turno (si se cancela cita)
    liberarTurno: async (turnoId) => {
        return await TurnoRepository.actualizarEstado(turnoId, 'DISPONIBLE');
    }
};

module.exports = MedicoService;