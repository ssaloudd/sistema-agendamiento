// Basado en tu Diagrama de Clases - Paquete MS Médicos
export interface Medico {
    id: string; // UUID
    cedula: string;
    nombres: string;
    apellidos: string;
    especialidades: string[]; // Simplificado para transporte
    email: string;
}

export interface TurnoMedico {
    id: string;
    medicoId: string;
    fecha: string; // ISO Date
    horaInicio: string;
    horaFin: string;
    estado: 'DISPONIBLE' | 'RESERVADO_TEMPORAL' | 'OCUPADO' | 'NO_DISPONIBLE';
}

// Basado en tu Diagrama de Clases - Paquete MS Pacientes
export interface Paciente {
    id: string;
    cedula: string;
    nombres: string;
    apellidos: string;
    email: string;
    telefono: string;
    tieneSeguro: boolean;
}

// Basado en tu Diagrama de Clases - Paquete MS Agendamiento
export interface Cita {
    id: string;
    pacienteId: string;
    medicoId: string;
    turnoId: string;
    fechaCreacion: string;
    estado: 'PENDIENTE' | 'CONFIRMADA' | 'ANULADA' | 'REALIZADA';
}

// Para el Bus de Eventos
export interface Evento {
    tipo: string; // Ej: "CitaCreada"
    datos: any;
    fecha: string;
}