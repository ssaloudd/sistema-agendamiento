const express = require('express');
const cors = require('cors');
const CitaController = require('./src/controllers/citaController');

const app = express();
app.use(express.json());
app.use(cors());

// RUTAS
// El Gateway redirige /agendamiento/* a este servicio
app.get('/', CitaController.getCitas);
app.post('/', CitaController.agendarCita);
app.post('/events', CitaController.recibirEvento);

const PORT = 4003;
app.listen(PORT, () => {
    console.log(`MS Agendamiento corriendo en puerto ${PORT}`);
});