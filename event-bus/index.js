// event-bus/index.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

// Almacenamiento temporal de eventos (opcional, para depuración)
const events = [];

app.post('/events', (req, res) => {
  const event = req.body;

  // 1. Guardar evento en historial
  events.push(event);
  console.log('Recibido Evento:', event.tipo);

  // 2. Reenviar el evento a los suscriptores (Microservicios)
  // NOTA: Si los servicios no están corriendo, esto dará error en consola,
  // es normal por ahora. Usamos catch() para que no tumbe el Bus.

  // MS Médicos (Puerto 4001)
  axios.post('http://localhost:4001/events', event).catch((err) => {
    console.log('MS Médicos no responde');
  });
  
  // MS Pacientes (Puerto 4002)
  axios.post('http://localhost:4002/events', event).catch((err) => {
    console.log('MS Pacientes no responde');
  });

  // MS Agendamiento (Puerto 4003)
  axios.post('http://localhost:4003/events', event).catch((err) => {
    console.log('MS Agendamiento no responde');
  });

  // MS Notificaciones (Puerto 4004)
  axios.post('http://localhost:4004/events', event).catch((err) => {
    console.log('MS Notificaciones no responde');
  });

  res.send({ status: 'OK' });
});

// Endpoint para ver historial de eventos (útil para debug)
app.get('/events', (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log('Event Bus escuchando en puerto 4005');
});