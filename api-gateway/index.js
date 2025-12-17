require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors());

// Usar variables de entorno
const PACIENTES_URL = process.env.MS_PACIENTES_URL || 'http://localhost:4002';
const MEDICOS_URL = process.env.MS_MEDICOS_URL || 'http://localhost:4001';
const AGENDAMIENTO_URL = process.env.MS_AGENDAMIENTO_URL || 'http://localhost:4003';
const NOTIFICACIONES_URL = process.env.MS_NOTIFICACIONES_URL || 'http://localhost:4004';
const PORT = process.env.PORT || 4000;

app.use('/pacientes', createProxyMiddleware({ target: PACIENTES_URL, changeOrigin: true }));
app.use('/medicos', createProxyMiddleware({ target: MEDICOS_URL, changeOrigin: true }));
app.use('/turnos', createProxyMiddleware({ target: MEDICOS_URL, changeOrigin: true })); // Para el detalle de turnos
app.use('/agendamiento', createProxyMiddleware({ target: AGENDAMIENTO_URL, changeOrigin: true }));
app.use('/notificaciones', createProxyMiddleware({ target: NOTIFICACIONES_URL, changeOrigin: true }));

app.listen(PORT, () => {
    console.log(`API Gateway corriendo en puerto ${PORT}`);
});