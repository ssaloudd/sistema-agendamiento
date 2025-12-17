const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notificacion = sequelize.define('Notificacion', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    destinatario: {
        type: DataTypes.STRING,
        allowNull: false
    },
    asunto: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cuerpoMensaje: { // En diagrama es cuerpoMensaje
        type: DataTypes.TEXT,
        allowNull: false
    },
    fechaCreacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    fechaEnvio: {
        type: DataTypes.DATE
    },
    intentos: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    estado: {
        type: DataTypes.ENUM('PENDIENTE', 'ENVIADO', 'FALLIDO', 'REINTENTADO'),
        defaultValue: 'PENDIENTE'
    },
    canal: {
        type: DataTypes.ENUM('EMAIL', 'WHATSAPP', 'SMS'),
        defaultValue: 'EMAIL'
    }
}, {
    timestamps: false,
    tableName: 'notificaciones'
});

module.exports = Notificacion;