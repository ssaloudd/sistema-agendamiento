const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/database');
const NotificacionController = require('./src/controllers/notificacionController');

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', NotificacionController.getNotificaciones);
app.post('/events', NotificacionController.recibirEvento);

const PORT = 4004;

sequelize.sync({ force: false }).then(() => {
    console.log('DB Notificaciones SQLite sincronizada');
    app.listen(PORT, () => {
        console.log(`MS Notificaciones corriendo en puerto ${PORT}`);
    });
});