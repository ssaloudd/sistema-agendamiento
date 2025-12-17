// Solo configura el servidor y las rutas.

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/database'); // Importar conexión
const PacienteController = require('./src/controllers/pacienteController');

const app = express();
app.use(express.json());
app.use(cors());

// RUTAS CRUD
app.get('/', PacienteController.getPacientes);
app.post('/', PacienteController.crearPaciente);
app.put('/:id', PacienteController.actualizarPaciente); // Nueva Ruta Update
app.delete('/:id', PacienteController.eliminarPaciente); // Nueva Ruta Delete

app.post('/events', PacienteController.recibirEvento);

const PORT = process.env.PORT || 4002;

// Sincronizar Base de Datos y Arrancar Servidor
// force: false asegura que NO borre los datos cada vez que reinicias
sequelize.sync({ force: false }).then(() => {
    console.log('Base de datos SQLite sincronizada');
    app.listen(PORT, () => {
        console.log(`MS Pacientes corriendo en puerto ${PORT}`);
    });
}).catch(error => {
    console.error('Error al sincronizar base de datos:', error);
});