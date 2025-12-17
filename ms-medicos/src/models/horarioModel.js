const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HorarioMedico = sequelize.define('HorarioMedico', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    medicoId: { type: DataTypes.UUID, allowNull: false },
    diaSemana: { 
        type: DataTypes.ENUM('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'),
        allowNull: false 
    },
    horaInicio: { type: DataTypes.TIME, allowNull: false },
    horaFin: { type: DataTypes.TIME, allowNull: false },
    esGuardia: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { timestamps: false, tableName: 'horarios_medicos' });

module.exports = HorarioMedico;