const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cita = sequelize.define('Cita', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    pacienteId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    medicoId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    // Guardamos redundancia para no consultar MS Medicos solo por el nombre en listados simples
    medicoNombre: {
        type: DataTypes.STRING 
    },
    turnoId: {
        type: DataTypes.STRING, // o UUID
        allowNull: false
    },
    motivoConsulta: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fechaCreacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    fechaCita: {  // <--- ESTE CAMPO ES EL IMPORTANTE
        type: DataTypes.STRING,
        allowNull: true
    },
    estado: {
        type: DataTypes.ENUM('PENDIENTE', 'CONFIRMADA', 'ANULADA', 'REALIZADA', 'AUSENTE'),
        defaultValue: 'PENDIENTE'
    }
}, {
    timestamps: false,
    tableName: 'citas'
});

module.exports = Cita;