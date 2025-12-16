// src/repositories/citaRepository.js
const Cita = require('../models/citaModel');

const CitaRepository = {
    findAll: async () => {
        return await Cita.findAll();
    },

    findById: async (id) => {
        return await Cita.findByPk(id);
    },

    create: async (datosCita) => {
        return await Cita.create(datosCita);
    },

    update: async (id, datosActualizados) => {
        const cita = await Cita.findByPk(id);
        if (!cita) return null;
        return await cita.update(datosActualizados);
    },
    
    // Método extra para lógica de negocio (ej. anular)
    updateEstado: async (id, nuevoEstado) => {
        const cita = await Cita.findByPk(id);
        if (!cita) return null;
        cita.estado = nuevoEstado;
        return await cita.save();
    }
};

module.exports = CitaRepository;