import { useState, useEffect } from 'react';
import MedicoService from '../services/medicoService';

const Medicos = () => {
  const [medicos, setMedicos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    cedula: '', nombres: '', apellidos: '',
    numeroLicencia: '', // Campo específico
    genero: 'Masculino', fechaNacimiento: '',
    estadoCivil: 'Soltero', telefono: '',
    email: '', direccion: ''
  });

  useEffect(() => {
    cargarMedicos();
  }, []);

  const cargarMedicos = async () => {
    try {
      const data = await MedicoService.getAll();
      setMedicos(data);
    } catch (error) {
      console.error("Error al cargar médicos:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (medico) => {
    setEditingId(medico.id);
    setFormData({
      cedula: medico.cedula,
      nombres: medico.nombres,
      apellidos: medico.apellidos,
      numeroLicencia: medico.numeroLicencia,
      genero: medico.genero || 'Masculino',
      fechaNacimiento: medico.fechaNacimiento || '',
      estadoCivil: medico.estadoCivil || 'Soltero',
      telefono: medico.telefono || '',
      email: medico.email,
      direccion: medico.direccion || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    limpiarForm();
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar médico?')) {
      await MedicoService.remove(id);
      cargarMedicos();
    }
  };

  const limpiarForm = () => {
    setFormData({
      cedula: '', nombres: '', apellidos: '', numeroLicencia: '',
      genero: 'Masculino', fechaNacimiento: '', estadoCivil: 'Soltero',
      telefono: '', email: '', direccion: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await MedicoService.update(editingId, formData);
        alert('Médico actualizado');
        setEditingId(null);
      } else {
        await MedicoService.create(formData);
        alert('Médico registrado');
      }
      cargarMedicos();
      limpiarForm();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.error || 'Desconocido'));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Gestión de Médicos</h2>

      {/* FORMULARIO */}
      <div className={`p-6 rounded-lg shadow-md mb-8 transition-colors ${editingId ? 'bg-green-50 border-2 border-green-200' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-semibold ${editingId ? 'text-green-700' : 'text-blue-600'}`}>
                {editingId ? 'Editar Médico' : 'Registrar Nuevo Médico'}
            </h3>
            {editingId && <button onClick={handleCancelEdit} className="text-red-600 text-sm">Cancelar Edición</button>}
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Cédula</label>
            <input required name="cedula" value={formData.cedula} onChange={handleChange} className="mt-1 p-2 w-full border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombres</label>
            <input required name="nombres" value={formData.nombres} onChange={handleChange} className="mt-1 p-2 w-full border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Apellidos</label>
            <input required name="apellidos" value={formData.apellidos} onChange={handleChange} className="mt-1 p-2 w-full border rounded" />
          </div>
          
          {/* Campo Especial de Licencia */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Núm. Licencia</label>
            <input required name="numeroLicencia" value={formData.numeroLicencia} onChange={handleChange} className="mt-1 p-2 w-full border rounded border-blue-300" placeholder="Ej: MED-2025-X" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input required type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 p-2 w-full border rounded" />
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
            <input name="telefono" value={formData.telefono} onChange={handleChange} className="mt-1 p-2 w-full border rounded" />
          </div>

          {/* Otros campos ocultables o secundarios para brevedad visual, pero requeridos por diagrama */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Género</label>
            <select name="genero" value={formData.genero} onChange={handleChange} className="mt-1 p-2 w-full border rounded">
               <option>Masculino</option><option>Femenino</option>
            </select>
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700">Fecha Nac.</label>
            <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} className="mt-1 p-2 w-full border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Estado Civil</label>
            <select name="estadoCivil" value={formData.estadoCivil} onChange={handleChange} className="mt-1 p-2 w-full border rounded">
              <option>Soltero</option><option>Casado</option><option>Divorciado</option>
            </select>
          </div>

          <div className="md:col-span-3">
             <button type="submit" className={`w-full p-2 rounded font-bold text-white ${editingId ? 'bg-green-600' : 'bg-blue-600'}`}>
                {editingId ? 'Actualizar Médico' : 'Guardar Médico'}
             </button>
          </div>
        </form>
      </div>

      {/* TABLA */}
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-xs">
              <th className="px-5 py-3 text-left">Licencia</th>
              <th className="px-5 py-3 text-left">Médico</th>
              <th className="px-5 py-3 text-left">Email</th>
              <th className="px-5 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {medicos.map((m) => (
              <tr key={m.id} className="border-b hover:bg-gray-50">
                <td className="px-5 py-4 text-sm font-mono text-blue-600">{m.numeroLicencia}</td>
                <td className="px-5 py-4 text-sm">{m.nombres} {m.apellidos}</td>
                <td className="px-5 py-4 text-sm">{m.email}</td>
                <td className="px-5 py-4 text-sm flex space-x-2">
                  <button onClick={() => handleEdit(m)} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded text-xs">Editar</button>
                  <button onClick={() => handleDelete(m.id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-xs">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Medicos;