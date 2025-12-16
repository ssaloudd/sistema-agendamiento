// src/services/notificacionService.js
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const NotificacionRepository = require('../repositories/notificacionRepository');

const NotificacionService = {
    obtenerTodas: () => {
        return NotificacionRepository.findAll();
    },

    procesarEvento: async (evento) => {
        // Solo nos interesa el evento CitaCreada por ahora
        if (evento.tipo === 'CitaCreada') {
            await crearNotificacionDeCita(evento.datos);
        }
    }
};

// Función auxiliar privada para manejar la lógica específica de la cita
async function crearNotificacionDeCita(datosCita) {
    const { pacienteId, fecha, id: citaId } = datosCita;
    
    let destinatario = "desconocido@correo.com";
    let canal = "EMAIL";

    // 1. Comunicación Síncrona: Consultar datos del paciente (Email/Teléfono) 
    try {
        // Obtenemos todos los pacientes y filtramos (ya que no creamos endpoint por ID específico aún)
        const response = await axios.get('http://localhost:4000/pacientes');
        const pacientes = response.data;
        const pacienteEncontrado = pacientes.find(p => p.id === pacienteId);
        
        if (pacienteEncontrado) {
            destinatario = pacienteEncontrado.email;
        }
    } catch (error) {
        console.error("Error consultando MS Pacientes:", error.message);
    }

    // 2. Crear Objeto Notificación con TODOS los atributos 
    const nuevaNotificacion = {
        id: uuidv4(),
        destinatario: destinatario,
        asunto: "Confirmación de Cita Médica",
        cuerpoMensaje: `Su cita ha sido agendada exitosamente para la fecha: ${fecha}. ID Cita: ${citaId}`,
        fechaCreacion: new Date().toISOString(),
        fechaEnvio: new Date().toISOString(), // Simulamos envío inmediato
        intentos: 1,
        estado: 'ENVIADO', // Enum [cite: 285]
        canal: canal       // Enum [cite: 279]
    };

    // 3. Persistencia
    NotificacionRepository.create(nuevaNotificacion);
    
    // 4. Simulación de envío (Output en consola)
    console.log(`[SIMULACION EMAIL] Enviando a: ${destinatario} | Asunto: ${nuevaNotificacion.asunto}`);
}

module.exports = NotificacionService;