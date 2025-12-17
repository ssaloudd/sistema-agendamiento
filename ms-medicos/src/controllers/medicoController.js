// Maneja las peticiones HTTP y extrae los datos del cuerpo de la petición

const MedicoService = require('../services/medicoService');

const MedicoController = {
    getMedicos: async (req, res) => {
        try {
            const medicos = await MedicoService.obtenerTodos();
            res.json(medicos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    crearMedico: async (req, res) => {
        try {
            const medico = await MedicoService.crearMedico(req.body);
            res.status(201).json(medico);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    actualizarMedico: async (req, res) => {
        try {
            const { id } = req.params;
            const medico = await MedicoService.actualizarMedico(id, req.body);
            res.json(medico);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    },

    eliminarMedico: async (req, res) => {
        try {
            const { id } = req.params;
            const resultado = await MedicoService.eliminarMedico(id);
            res.json(resultado);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    },

    verificarDisponibilidad: async (req, res) => {
        const { id } = req.params;
        const disponible = await MedicoService.verificarDisponibilidad(id);
        res.json({ disponible });
    },

    // POST /medicos/:id/agenda
    generarAgenda: async (req, res) => {
        try {
            const { id } = req.params;
            const { fecha } = req.body; // YYYY-MM-DD
            if(!fecha) return res.status(400).json({error: "Fecha requerida"});
            
            const turnos = await MedicoService.generarAgendaDiaria(id, fecha);
            res.json({ message: `Se generaron ${turnos.length} turnos para el día ${fecha}`, turnos });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /medicos/:id/turnos?fecha=YYYY-MM-DD
    getTurnosDisponibles: async (req, res) => {
        try {
            const { id } = req.params;
            const { fecha } = req.query;
            if(!fecha) return res.status(400).json({error: "Query param 'fecha' requerido"});

            const turnos = await MedicoService.obtenerTurnosDisponibles(id, fecha);
            res.json(turnos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /turnos/:id
    getTurnoDetalle: async (req, res) => {
        try {
            const { id } = req.params;
            // Usamos el repositorio de turnos que ya importaste en el Service, 
            // pero para rápido acceso lo pediremos al Service.
            // Necesitamos asegurarnos que el Service tenga un método findById o usar el repo directo.
            // Vamos a agregarlo al service primero (ver paso siguiente), aquí solo lo llamamos:
            const turno = await MedicoService.obtenerTurnoPorId(id);
            if (!turno) return res.status(404).json({ error: "Turno no encontrado" });
            res.json(turno);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    // Webhook para eventos
    recibirEvento: async (req, res) => {
        const { tipo, datos } = req.body;
        console.log(`Evento recibido en MS Medicos: ${tipo}`, datos); // Log para ver qué llega
        
        try {
            // Reacción REACTIVA: Si se crea una cita, ocupamos el turno
            if (tipo === 'CitaCreada') {
                // Verificamos que venga el turnoId
                if (datos && datos.turnoId) {
                    await MedicoService.ocuparTurno(datos.turnoId);
                    console.log(`>>> ÉXITO: Turno ${datos.turnoId} cambiado a OCUPADO`);
                } else {
                    console.log(">>> ADVERTENCIA: Evento CitaCreada sin turnoId");
                }
            }
            // Si se anula, liberamos
            else if (tipo === 'CitaAnulada') {
                 // Aquí iría la lógica para liberar si tuvieras el turnoId
                 console.log('Evento CitaAnulada recibido');
            }
        } catch (error) {
            console.error("Error procesando evento en Medicos:", error.message);
        }

        res.send({});
    }
};

module.exports = MedicoController;