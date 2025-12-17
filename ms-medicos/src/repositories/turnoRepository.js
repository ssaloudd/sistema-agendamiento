const TurnoMedico = require('../models/turnoModel');
const { Op } = require('sequelize'); // Operadores de Sequelize

const TurnoRepository = {
    // Buscar turnos de un médico en una fecha específica
    findByMedicoAndFecha: async (medicoId, fecha) => {
        return await TurnoMedico.findAll({
            where: {
                medicoId,
                fecha,
                estado: 'DISPONIBLE' // Solo queremos ver los libres
            },
            order: [['horaInicio', 'ASC']]
        });
    },

    findById: async (id) => {
        return await TurnoMedico.findByPk(id);
    },

    createBulk: async (turnosArray) => {
        return await TurnoMedico.bulkCreate(turnosArray);
    },

    actualizarEstado: async (id, nuevoEstado) => {
        const turno = await TurnoMedico.findByPk(id);
        if (turno) {
            turno.estado = nuevoEstado;
            return await turno.save();
        }
        return null;
    }
};

module.exports = TurnoRepository;