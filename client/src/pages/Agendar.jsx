import { useState, useEffect } from 'react';
import AgendamientoService from '../services/agendamientoService';
import PacienteService from '../services/pacienteService';
import MedicoService from '../services/medicoService';
import TurnoDisplay from '../components/TurnoDisplay';

const Agendar = () => {
  // --- ESTADOS ---
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [citas, setCitas] = useState([]);
  
  // Estado para manejo de turnos visuales
  const [turnosDisponibles, setTurnosDisponibles] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [turnoSeleccionadoObj, setTurnoSeleccionadoObj] = useState(null); // Para mostrar hora en resumen
  const [loadingTurnos, setLoadingTurnos] = useState(false);

  const [formData, setFormData] = useState({
    pacienteId: '',
    medicoId: '',
    turnoId: '',
    motivoConsulta: ''
  });

  // Carga inicial de catálogos
  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  // Efecto: Cuando cambia Médico o Fecha, buscamos turnos automáticamente
  useEffect(() => {
    if (formData.medicoId && fechaSeleccionada) {
      cargarTurnos(formData.medicoId, fechaSeleccionada);
    } else {
      setTurnosDisponibles([]);
    }
  }, [formData.medicoId, fechaSeleccionada]);

  const cargarDatosIniciales = async () => {
    try {
      const [pacientesData, medicosData, citasData] = await Promise.all([
        PacienteService.getAll(),
        MedicoService.getAll(),
        AgendamientoService.getAll()
      ]);
      setPacientes(pacientesData);
      setMedicos(medicosData);
      setCitas(citasData);
    } catch (error) {
      console.error("Error cargando datos:", error);
      alert("Error conectando con los servicios.");
    }
  };

  const cargarTurnos = async (medicoId, fecha) => {
    setLoadingTurnos(true);
    setTurnoSeleccionadoObj(null); // Resetear selección
    setFormData(prev => ({ ...prev, turnoId: '' })); // Limpiar ID turno
    try {
      const turnos = await MedicoService.getTurnosDisponibles(medicoId, fecha);
      setTurnosDisponibles(turnos);
    } catch (error) {
      console.error("Error cargando turnos:", error);
    } finally {
      setLoadingTurnos(false);
    }
  };

  // Función para poblar la agenda desde el botón (Facilita pruebas)
  const handleGenerarAgenda = async () => {
    if (!formData.medicoId || !fechaSeleccionada) return;
    try {
      setLoadingTurnos(true);
      await MedicoService.generarAgenda(formData.medicoId, fechaSeleccionada);
      // Recargar inmediatamente
      await cargarTurnos(formData.medicoId, fechaSeleccionada);
    } catch (error) {
      alert("Error generando agenda: " + error.message);
    } finally {
      setLoadingTurnos(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSeleccionarTurno = (turno) => {
    setFormData({ ...formData, turnoId: turno.id });
    setTurnoSeleccionadoObj(turno);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validaciones extra
      if (!formData.turnoId) {
        alert("Por favor seleccione un horario disponible.");
        return;
      }

      const medicoSeleccionado = medicos.find(m => m.id === formData.medicoId);
      const medicoNombre = medicoSeleccionado ? `${medicoSeleccionado.nombres} ${medicoSeleccionado.apellidos}` : 'Desconocido';

      // Enviamos el ID del turno REAL (UUID)
      await AgendamientoService.create({
        ...formData,
        medicoNombre
      });

      alert('Cita agendada con éxito');
      
      // Actualizar todo
      const nuevasCitas = await AgendamientoService.getAll();
      setCitas(nuevasCitas);
      // Recargar turnos (el que seleccioné debería desaparecer o salir ocupado)
      cargarTurnos(formData.medicoId, fechaSeleccionada);
      
      // Limpiar form parcial
      setFormData(prev => ({ ...prev, pacienteId: '', motivoConsulta: '', turnoId: '' }));
      setTurnoSeleccionadoObj(null);

    } catch (error) {
      console.error(error);
      alert('Error al agendar: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleAnular = async (id) => {
    if (window.confirm('¿Está seguro de anular esta cita?')) {
      try {
        await AgendamientoService.anular(id);
        alert('Cita anulada');
        const nuevasCitas = await AgendamientoService.getAll();
        setCitas(nuevasCitas);
        // Si anulamos una cita de hoy, recargamos los turnos para ver que se libera
        if (formData.medicoId && fechaSeleccionada) {
            cargarTurnos(formData.medicoId, fechaSeleccionada);
        }
      } catch (error) {
        alert('Error al anular cita');
      }
    }
  };

  const getNombrePaciente = (id) => {
    const p = pacientes.find(pac => pac.id === id);
    return p ? `${p.nombres} ${p.apellidos}` : 'Desconocido';
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Agendamiento de Citas</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- COLUMNA IZQUIERDA: FORMULARIO WIZARD --- */}
        <div className="bg-white p-6 rounded-lg shadow-md h-fit">
          <h3 className="text-lg font-semibold mb-4 text-purple-600 border-b pb-2">Nueva Cita</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* 1. Selección de Paciente */}
            <div>
              <label className="block text-sm font-medium text-gray-700">1. Paciente</label>
              <select 
                name="pacienteId" 
                value={formData.pacienteId} 
                onChange={handleChange} 
                required
                className="mt-1 p-2 w-full border rounded focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">-- Seleccione Paciente --</option>
                {pacientes.map(p => (
                  <option key={p.id} value={p.id}>{p.cedula} - {p.nombres} {p.apellidos}</option>
                ))}
              </select>
            </div>

            {/* 2. Selección de Médico y Fecha */}
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700">2. Médico</label>
                    <select 
                        name="medicoId" 
                        value={formData.medicoId} 
                        onChange={handleChange} 
                        required
                        className="mt-1 p-2 w-full border rounded text-sm"
                    >
                        <option value="">-- Médico --</option>
                        {medicos.map(m => (
                        <option key={m.id} value={m.id}>{m.nombres} {m.apellidos}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">3. Fecha</label>
                    <input 
                        type="date" 
                        value={fechaSeleccionada}
                        onChange={(e) => setFechaSeleccionada(e.target.value)}
                        required
                        className="mt-1 p-2 w-full border rounded text-sm"
                    />
                </div>
            </div>

            {/* 3. Selección de Turno (Slot) */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">4. Turno Disponible</label>
                
                {/* Estado Loading */}
                {loadingTurnos && <p className="text-xs text-gray-500 animate-pulse">Buscando disponibilidad...</p>}

                {/* Grid de Botones */}
                {!loadingTurnos && turnosDisponibles.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1 border rounded bg-gray-50">
                        {turnosDisponibles.map(turno => (
                            <button
                                key={turno.id}
                                type="button"
                                onClick={() => handleSeleccionarTurno(turno)}
                                className={`text-xs py-2 px-1 rounded border transition font-medium
                                    ${formData.turnoId === turno.id 
                                        ? 'bg-purple-600 text-white border-purple-600 shadow-md' 
                                        : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                                    }`}
                            >
                                {turno.horaInicio.slice(0, 5)}
                            </button>
                        ))}
                    </div>
                )}

                {/* Estado Vacío / Botón Mágico Generar */}
                {!loadingTurnos && turnosDisponibles.length === 0 && formData.medicoId && fechaSeleccionada && (
                    <div className="text-center p-3 border-2 border-dashed border-gray-300 rounded bg-gray-50">
                        <p className="text-xs text-gray-500 mb-2">No hay agenda abierta.</p>
                        <button 
                            type="button"
                            onClick={handleGenerarAgenda}
                            className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 font-bold"
                        >
                            + Generar Agenda (Demo)
                        </button>
                    </div>
                )}
                
                {(!formData.medicoId || !fechaSeleccionada) && (
                    <p className="text-xs text-gray-400 italic">Seleccione médico y fecha para ver horarios.</p>
                )}
            </div>

            {/* Resumen de Selección */}
            {turnoSeleccionadoObj && (
                <div className="bg-purple-50 p-2 rounded border border-purple-100 text-sm text-purple-800">
                    <strong>Resumen:</strong> {turnoSeleccionadoObj.horaInicio} - {turnoSeleccionadoObj.horaFin}
                </div>
            )}

            {/* 5. Motivo */}
            <div>
              <label className="block text-sm font-medium text-gray-700">5. Motivo</label>
              <textarea 
                name="motivoConsulta" 
                value={formData.motivoConsulta} 
                onChange={handleChange} 
                required
                rows="2"
                className="mt-1 p-2 w-full border rounded text-sm"
              ></textarea>
            </div>

            <button 
                type="submit" 
                disabled={!formData.turnoId}
                className={`w-full font-bold py-2 px-4 rounded transition
                    ${formData.turnoId 
                        ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              Confirmar Agendamiento
            </button>
          </form>
        </div>

        {/* --- COLUMNA DERECHA: LISTADO --- */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Citas Programadas</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr className="bg-gray-50 text-gray-600 uppercase text-xs">
                  <th className="px-4 py-3 text-left">Fecha/Hora</th>
                  <th className="px-4 py-3 text-left">Paciente</th>
                  <th className="px-4 py-3 text-left">Médico</th>
                  <th className="px-4 py-3 text-left">Estado</th>
                  <th className="px-4 py-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {citas.map((c) => (
                  <tr key={c.id} className="border-b hover:bg-gray-50 text-sm">
                    <td className="px-4 py-3">
                      <TurnoDisplay turnoId={c.turnoId} />
                    </td>
                    <td className="px-4 py-3">{getNombrePaciente(c.pacienteId)}</td>
                    <td className="px-4 py-3">{c.medicoNombre}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold 
                        ${c.estado === 'PENDIENTE' ? 'bg-yellow-200 text-yellow-800' : 
                          c.estado === 'ANULADA' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                        {c.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {c.estado !== 'ANULADA' && (
                        <button 
                          onClick={() => handleAnular(c.id)}
                          className="text-red-500 hover:text-red-700 font-semibold text-xs border border-red-200 px-2 py-1 rounded hover:bg-red-50"
                        >
                          Anular
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {citas.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-400">
                      No hay citas registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agendar;