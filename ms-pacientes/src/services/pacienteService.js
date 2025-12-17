// Van las reglas, validaciones y la comunicación con otros servicios (Event Bus).

const axios = require('axios');
const PacienteRepository = require('../repositories/pacienteRepository');
const EVENT_BUS = process.env.EVENT_BUS_URL || 'http://localhost:4005';

const PacienteService = {
    obtenerTodos: async () => {
        return await PacienteRepository.findAll();
    },

    crearPaciente: async (datos) => {
        // Validaciones estrictas
        const { cedula, nombres, apellidos, genero, fechaNacimiento, estadoCivil, telefono, email, direccion } = datos;

        if (!cedula || !nombres || !apellidos || !email) {
            throw new Error("Faltan datos obligatorios del Paciente");
        }

        // Verificar duplicados (Regla de Negocio)
        const existe = await PacienteRepository.findByCedula(cedula);
        if (existe) {
            throw new Error("Ya existe un paciente con esa cédula");
        }

        // Crear en BD
        const pacienteCreado = await PacienteRepository.create({
            cedula, nombres, apellidos, genero, 
            fechaNacimiento, estadoCivil, telefono, 
            email, direccion
        });

        // Evento al Bus
        try {
            await axios.post(`${EVENT_BUS}/events`, {
                tipo: 'PacienteCreado',
                datos: pacienteCreado
            });
        } catch (error) {
            console.log('Advertencia: El Bus de Eventos no responde');
        }

        return pacienteCreado;
    },

    actualizarPaciente: async (id, datos) => {
        const pacienteActualizado = await PacienteRepository.update(id, datos);
        if (!pacienteActualizado) {
            throw new Error("Paciente no encontrado para actualizar");
        }
        return pacienteActualizado;
    },

    eliminarPaciente: async (id) => {
        const eliminado = await PacienteRepository.delete(id);
        if (!eliminado) {
            throw new Error("Paciente no encontrado para eliminar");
        }
        return { message: "Paciente eliminado correctamente" };
    }
};

module.exports = PacienteService;