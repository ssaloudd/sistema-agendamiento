const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/database');
const CitaController = require('./src/controllers/citaController');

const app = express();
app.use(express.json());
app.use(cors());

// Rutas
app.get('/', CitaController.getCitas);
app.post('/', CitaController.agendarCita);
app.put('/:id/anular', CitaController.anularCita); // Endpoint específico para cambio de estado
app.post('/events', CitaController.recibirEvento);

const PORT = 4003;

sequelize.sync({ force: false }).then(() => {
    console.log('Base de datos Citas SQLite sincronizada');
    app.listen(PORT, () => {
        console.log(`MS Agendamiento corriendo en puerto ${PORT}`);
    });
});