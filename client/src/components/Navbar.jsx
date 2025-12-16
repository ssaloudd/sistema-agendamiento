import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Sistema Médico</h1>
        <ul className="flex space-x-4">
          <li><Link to="/pacientes" className="hover:text-blue-200">Pacientes</Link></li>
          <li><Link to="/medicos" className="hover:text-blue-200">Médicos</Link></li>
          <li><Link to="/agendar" className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100 font-bold">Agendar Cita</Link></li>
          <li><Link to="/notificaciones" className="hover:text-blue-200">Notificaciones</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;