// Solo se encarga de guardar y recuperar datos. No toma decisiones.

const Paciente = require('../models/pacienteModel');

const PacienteRepository = {
    findAll: async () => {
        return await Paciente.findAll();
    },

    findById: async (id) => {
        return await Paciente.findByPk(id);
    },

    findByCedula: async (cedula) => {
        return await Paciente.findOne({ where: { cedula } });
    },

    create: async (datosPaciente) => {
        return await Paciente.create(datosPaciente);
    },

    update: async (id, datosActualizados) => {
        const paciente = await Paciente.findByPk(id);
        if (!paciente) return null;
        return await paciente.update(datosActualizados);
    },

    delete: async (id) => {
        const paciente = await Paciente.findByPk(id);
        if (!paciente) return null;
        await paciente.destroy();
        return true;
    }
};

module.exports = PacienteRepository;