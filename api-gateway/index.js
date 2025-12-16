// api-gateway/index.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors()); // Permite que el Frontend (React) haga peticiones aquí

// Definición de Rutas Proxy
// Si llega una petición a localhost:4000/medicos/* -> Redirige a localhost:4001
app.use('/medicos', createProxyMiddleware({ 
    target: 'http://localhost:4001', 
    changeOrigin: true 
}));

// Si llega a /pacientes/* -> Redirige a localhost:4002
app.use('/pacientes', createProxyMiddleware({ 
    target: 'http://localhost:4002', 
    changeOrigin: true 
}));

// Si llega a /agendamiento/* -> Redirige a localhost:4003
app.use('/agendamiento', createProxyMiddleware({ 
    target: 'http://localhost:4003', 
    changeOrigin: true 
}));

// Si llega a /notificaciones/* -> Redirige a localhost:4004
app.use('/notificaciones', createProxyMiddleware({ 
    target: 'http://localhost:4004', 
    changeOrigin: true 
}));

app.listen(4000, () => {
  console.log('API Gateway corriendo en puerto 4000');
});