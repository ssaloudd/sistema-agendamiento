// event-bus/index.js
require('dotenv').config(); // <--- IMPORTANTE
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 4005;

// URLs de los suscriptores
const MS_MEDICOS = process.env.MS_MEDICOS_URL || 'http://localhost:4001';
const MS_PACIENTES = process.env.MS_PACIENTES_URL || 'http://localhost:4002';
const MS_AGENDAMIENTO = process.env.MS_AGENDAMIENTO_URL || 'http://localhost:4003';
const MS_NOTIFICACIONES = process.env.MS_NOTIFICACIONES_URL || 'http://localhost:4004';

app.post('/events', (req, res) => {
  const event = req.body;
  console.log('Recibido Evento:', event.tipo);

  // Reenviar eventos usando las variables
  axios.post(`${MS_MEDICOS}/events`, event).catch((err) => console.log('MS Médicos no responde'));
  axios.post(`${MS_PACIENTES}/events`, event).catch((err) => console.log('MS Pacientes no responde'));
  axios.post(`${MS_AGENDAMIENTO}/events`, event).catch((err) => console.log('MS Agendamiento no responde'));
  axios.post(`${MS_NOTIFICACIONES}/events`, event).catch((err) => console.log('MS Notificaciones no responde'));

  res.send({ status: 'OK' });
});

app.get('/events', (req, res) => res.send([])); // Historial simple

app.listen(PORT, () => {
  console.log(`Event Bus escuchando en puerto ${PORT}`);
});