// Base de datos en memoria
// persistencia en memoria de los médicos

const Medico = require('../models/medicoModel');

const MedicoRepository = {
    findAll: async () => {
        return await Medico.findAll();
    },

    findById: async (id) => {
        return await Medico.findByPk(id);
    },

    findByCedula: async (cedula) => {
        return await Medico.findOne({ where: { cedula } });
    },

    create: async (datosMedico) => {
        return await Medico.create(datosMedico);
    },

    update: async (id, datosActualizados) => {
        const medico = await Medico.findByPk(id);
        if (!medico) return null;
        return await medico.update(datosActualizados);
    },

    delete: async (id) => {
        const medico = await Medico.findByPk(id);
        if (!medico) return null;
        await medico.destroy();
        return true;
    }
};

module.exports = MedicoRepository;