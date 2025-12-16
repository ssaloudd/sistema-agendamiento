const { Sequelize } = require('sequelize');
const path = require('path');

// Creamos la conexión. El archivo se guardará como 'database.sqlite' en la raíz del servicio
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../database.sqlite'), 
    logging: false // Ponlo en true si quieres ver las consultas SQL en consola
});

module.exports = sequelize;