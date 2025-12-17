const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TurnoMedico = sequelize.define('TurnoMedico', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    medicoId: { type: DataTypes.UUID, allowNull: false },
    fecha: { type: DataTypes.DATEONLY, allowNull: false }, // YYYY-MM-DD
    horaInicio: { type: DataTypes.TIME, allowNull: false },
    horaFin: { type: DataTypes.TIME, allowNull: false },
    estado: { 
        type: DataTypes.ENUM('DISPONIBLE', 'RESERVADO_TEMPORAL', 'OCUPADO', 'NO_DISPONIBLE'),
        defaultValue: 'DISPONIBLE'
    }
}, { timestamps: false, tableName: 'turnos_medicos' });

module.exports = TurnoMedico;