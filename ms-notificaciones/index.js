const express = require('express');
const cors = require('cors');
const NotificacionController = require('./src/controllers/notificacionController');

const app = express();
app.use(express.json());
app.use(cors());

// RUTAS
// El Gateway redirige /notificaciones -> localhost:4004/
app.get('/', NotificacionController.getNotificaciones);

// Endpoint para el Bus de Eventos
app.post('/events', NotificacionController.recibirEvento);

const PORT = 4004;
app.listen(PORT, () => {
    console.log(`MS Notificaciones corriendo en puerto ${PORT}`);
});