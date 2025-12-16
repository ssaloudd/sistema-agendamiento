import { useState, useEffect } from 'react';
import PacienteService from '../services/pacienteService';

const Pacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [editingId, setEditingId] = useState(null); // NULL = Modo Crear, UUID = Modo Editar
  
  const [formData, setFormData] = useState({
    cedula: '',
    nombres: '',
    apellidos: '',
    genero: 'Masculino',
    fechaNacimiento: '',
    estadoCivil: 'Soltero',
    telefono: '',
    email: '',
    direccion: ''
  });

  useEffect(() => {
    cargarPacientes();
  }, []);

  const cargarPacientes = async () => {
    try {
      const data = await PacienteService.getAll();
      setPacientes(data);
    } catch (error) {
      console.error("Error cargando pacientes:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Lógica para cargar los datos en el formulario al pulsar "Editar"
  const handleEdit = (paciente) => {
    setEditingId(paciente.id);
    setFormData({
      cedula: paciente.cedula,
      nombres: paciente.nombres,
      apellidos: paciente.apellidos,
      genero: paciente.genero || 'Masculino',
      fechaNacimiento: paciente.fechaNacimiento || '',
      estadoCivil: paciente.estadoCivil || 'Soltero',
      telefono: paciente.telefono || '',
      email: paciente.email,
      direccion: paciente.direccion || ''
    });
    // Scroll suave hacia el formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Lógica para cancelar la edición
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      cedula: '', nombres: '', apellidos: '', genero: 'Masculino',
      fechaNacimiento: '', estadoCivil: 'Soltero', telefono: '',
      email: '', direccion: ''
    });
  };

  // Lógica para eliminar
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este paciente?')) {
      try {
        await PacienteService.remove(id);
        alert('Paciente eliminado');
        cargarPacientes();
      } catch (error) {
        alert('Error al eliminar');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // MODO ACTUALIZAR
        await PacienteService.update(editingId, formData);
        alert('Paciente actualizado con éxito');
        setEditingId(null); // Salir de modo edición
      } else {
        // MODO CREAR
        await PacienteService.create(formData);
        alert('Paciente registrado con éxito');
      }
      
      cargarPacientes();
      // Limpiar formulario
      setFormData({
        cedula: '', nombres: '', apellidos: '', genero: 'Masculino',
        fechaNacimiento: '', estadoCivil: 'Soltero', telefono: '',
        email: '', direccion: ''
      });
    } catch (error) {
      console.error(error);
      alert('Error: ' + (error.response?.data?.error || 'Error desconocido'));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Gestión de Pacientes</h2>

      {/* --- FORMULARIO --- */}
      <div className={`p-6 rounded-lg shadow-md mb-8 transition-colors ${editingId ? 'bg-yellow-50 border-2 border-yellow-200' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-semibold ${editingId ? 'text-yellow-700' : 'text-blue-600'}`}>
                {editingId ? 'Editar Paciente' : 'Registrar Nuevo Paciente'}
            </h3>
            {editingId && (
                <button onClick={handleCancelEdit} className="text-sm text-red-600 hover:underline">
                    Cancelar Edición
                </button>
            )}
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Fila 1 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Cédula</label>
            <input required name="cedula" value={formData.cedula} onChange={handleChange} type="text" className="mt-1 p-2 w-full border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombres</label>
            <input required name="nombres" value={formData.nombres} onChange={handleChange} type="text" className="mt-1 p-2 w-full border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Apellidos</label>
            <input required name="apellidos" value={formData.apellidos} onChange={handleChange} type="text" className="mt-1 p-2 w-full border rounded" />
          </div>

          {/* Fila 2 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Género</label>
            <select name="genero" value={formData.genero} onChange={handleChange} className="mt-1 p-2 w-full border rounded">
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha Nacimiento</label>
            <input name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} type="date" className="mt-1 p-2 w-full border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Estado Civil</label>
            <select name="estadoCivil" value={formData.estadoCivil} onChange={handleChange} className="mt-1 p-2 w-full border rounded">
              <option value="Soltero">Soltero</option>
              <option value="Casado">Casado</option>
              <option value="Divorciado">Divorciado</option>
              <option value="Viudo">Viudo</option>
            </select>
          </div>

          {/* Fila 3 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input required name="email" value={formData.email} onChange={handleChange} type="email" className="mt-1 p-2 w-full border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
            <input name="telefono" value={formData.telefono} onChange={handleChange} type="text" className="mt-1 p-2 w-full border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Dirección</label>
            <input name="direccion" value={formData.direccion} onChange={handleChange} type="text" className="mt-1 p-2 w-full border rounded" />
          </div>

          <div className="md:col-span-3">
            <button type="submit" 
                className={`w-full p-2 rounded font-bold transition text-white 
                ${editingId ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {editingId ? 'Actualizar Paciente' : 'Guardar Paciente'}
            </button>
          </div>
        </form>
      </div>

      {/* --- TABLA --- */}
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Pacientes Registrados</h3>
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cédula</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nombre</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-5 py-5 border-b border-gray-200 text-sm">{p.cedula}</td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">{p.nombres} {p.apellidos}</td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">{p.email}</td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm flex space-x-2">
                  <button 
                    onClick={() => handleEdit(p)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded text-xs">
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-xs">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {pacientes.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">No hay pacientes registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Pacientes;