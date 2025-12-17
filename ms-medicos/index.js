// ms-medicos/index.js
const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/database');
const MedicoController = require('./src/controllers/medicoController');

const app = express();
app.use(express.json());
app.use(cors());

// Rutas CRUD
app.get('/', MedicoController.getMedicos);
app.post('/', MedicoController.crearMedico);
app.put('/:id', MedicoController.actualizarMedico);
app.delete('/:id', MedicoController.eliminarMedico);

// Rutas Específicas
app.get('/:id/verificar-disponibilidad', MedicoController.verificarDisponibilidad);
app.post('/events', MedicoController.recibirEvento);

// RUTAS DE TURNOS
app.post('/:id/agenda', MedicoController.generarAgenda); // Generar slots
app.get('/:id/turnos', MedicoController.getTurnosDisponibles); // Consultar slots

// CONSULTAR UN TURNO ESPECÍFICO
app.get('/turnos/:id', MedicoController.getTurnoDetalle);

const PORT = 4001;

sequelize.sync({ force: false }).then(() => {
    console.log('Base de datos Médicos SQLite sincronizada');
    app.listen(PORT, () => {
        console.log(`MS Medicos corriendo en puerto ${PORT}`);
    });
});