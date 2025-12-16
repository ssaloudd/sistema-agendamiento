const axios = require('axios');
const MedicoRepository = require('../repositories/medicoRepository');

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
    }
};

module.exports = MedicoService;