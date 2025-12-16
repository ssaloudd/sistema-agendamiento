const axios = require('axios');
const NotificacionRepository = require('../repositories/notificacionRepository');

const NotificacionService = {
    obtenerTodas: async () => {
        return await NotificacionRepository.findAll();
    },

    procesarEvento: async (evento) => {
        if (evento.tipo === 'CitaCreada') {
            await crearNotificacionDeCita(evento.datos);
        } else if (evento.tipo === 'CitaAnulada') {
            // Lógica extra: Notificar anulación
            await crearNotificacionGenerica("Cita Anulada", `La cita ${evento.datos.id} ha sido anulada.`);
        }
    }
};

async function crearNotificacionDeCita(datosCita) {
    const { pacienteId, fecha, id: citaId } = datosCita;
    let destinatario = "admin@hospital.com"; // Fallback

    // 1. Obtener datos contacto (Consulta Síncrona)
    try {
        // En producción idealmente usaríamos un endpoint GET /pacientes/:id
        const response = await axios.get('http://localhost:4000/pacientes');
        const paciente = response.data.find(p => p.id === pacienteId);
        if (paciente) destinatario = paciente.email;
    } catch (error) {
        console.error("Error contactando MS Pacientes", error.message);
    }

    // 2. Persistir
    const notificacion = await NotificacionRepository.create({
        destinatario,
        asunto: "Confirmación de Cita",
        cuerpoMensaje: `Su cita (ID: ${citaId}) ha sido agendada para: ${new Date(fecha).toLocaleString()}`,
        fechaCreacion: new Date(),
        fechaEnvio: new Date(),
        intentos: 1,
        estado: 'ENVIADO',
        canal: 'EMAIL'
    });

    console.log(`[NOTIFICACION DB] Guardada para: ${destinatario}`);
    return notificacion;
}

async function crearNotificacionGenerica(asunto, mensaje) {
    await NotificacionRepository.create({
        destinatario: "sistema@hospital.com",
        asunto,
        cuerpoMensaje: mensaje,
        fechaEnvio: new Date(),
        estado: 'ENVIADO',
        canal: 'SMS'
    });
}

module.exports = NotificacionService;