import { useState, useEffect } from 'react';
import AgendamientoService from '../services/agendamientoService';
import PacienteService from '../services/pacienteService';
import MedicoService from '../services/medicoService';

const Agendar = () => {
  // Listas para los "Select"
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [citas, setCitas] = useState([]);

  // Formulario
  const [formData, setFormData] = useState({
    pacienteId: '',
    medicoId: '',
    turnoId: '', // En un sistema real, esto vendría de seleccionar un hueco en un calendario
    motivoConsulta: ''
  });

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      // Cargar todo en paralelo para rapidez
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
      alert("Error cargando listas necesarias. Verifique que todos los microservicios estén activos.");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Necesitamos enviar el nombre del médico también (redundancia requerida por backend)
      const medicoSeleccionado = medicos.find(m => m.id === formData.medicoId);
      const medicoNombre = medicoSeleccionado ? `${medicoSeleccionado.nombres} ${medicoSeleccionado.apellidos}` : 'Desconocido';

      await AgendamientoService.create({
        ...formData,
        medicoNombre
      });

      alert('Cita agendada con éxito');
      
      // Recargar lista de citas y limpiar form
      const nuevasCitas = await AgendamientoService.getAll();
      setCitas(nuevasCitas);
      setFormData({ pacienteId: '', medicoId: '', turnoId: '', motivoConsulta: '' });

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
        // Actualizar UI
        const nuevasCitas = await AgendamientoService.getAll();
        setCitas(nuevasCitas);
      } catch (error) {
        alert('Error al anular cita');
      }
    }
  };

  // Función auxiliar para obtener nombre de paciente por ID (para mostrar en la tabla)
  const getNombrePaciente = (id) => {
    const p = pacientes.find(pac => pac.id === id);
    return p ? `${p.nombres} ${p.apellidos}` : id;
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Agendamiento de Citas</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- COLUMNA IZQUIERDA: FORMULARIO --- */}
        <div className="bg-white p-6 rounded-lg shadow-md h-fit">
          <h3 className="text-lg font-semibold mb-4 text-purple-600 border-b pb-2">Nueva Cita</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Selección de Paciente */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Paciente</label>
              <select 
                name="pacienteId" 
                value={formData.pacienteId} 
                onChange={handleChange} 
                required
                className="mt-1 p-2 w-full border rounded focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">-- Seleccione Paciente --</option>
                {pacientes.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.cedula} - {p.nombres} {p.apellidos}
                  </option>
                ))}
              </select>
            </div>

            {/* Selección de Médico */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Médico</label>
              <select 
                name="medicoId" 
                value={formData.medicoId} 
                onChange={handleChange} 
                required
                className="mt-1 p-2 w-full border rounded focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">-- Seleccione Médico --</option>
                {medicos.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.especialidades?.[0] || 'Gral'} - {m.nombres} {m.apellidos}
                  </option>
                ))}
              </select>
            </div>

            {/* Turno (Simulado como texto por ahora) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">ID Turno / Horario</label>
              <input 
                type="text" 
                name="turnoId" 
                value={formData.turnoId} 
                onChange={handleChange} 
                placeholder="Ej: TURNO-10:00AM"
                required
                className="mt-1 p-2 w-full border rounded"
              />
              <p className="text-xs text-gray-400 mt-1">* En producción, esto sería un selector de calendario</p>
            </div>

            {/* Motivo */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Motivo de Consulta</label>
              <textarea 
                name="motivoConsulta" 
                value={formData.motivoConsulta} 
                onChange={handleChange} 
                required
                rows="3"
                className="mt-1 p-2 w-full border rounded"
              ></textarea>
            </div>

            <button type="submit" className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded hover:bg-purple-700 transition">
              Confirmar Agendamiento
            </button>
          </form>
        </div>

        {/* --- COLUMNA DERECHA: LISTADO DE CITAS --- */}
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
                      <div className="font-bold">{c.turnoId}</div>
                      <div className="text-xs text-gray-500">{new Date(c.fechaCreacion).toLocaleDateString()}</div>
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
                      No hay citas registradas en el sistema.
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