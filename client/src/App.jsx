import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Pacientes from './pages/Pacientes';
import Medicos from './pages/Medicos';
import Agendar from './pages/Agendar';

// Placeholder components
const Home = () => <div className="p-10 text-center text-2xl">Bienvenido al Sistema de Gestión Hospitalaria</div>;
const Notificaciones = () => <div className="p-10">Buzón de Notificaciones (En construcción)</div>;

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto mt-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pacientes" element={<Pacientes />} /> {/* <-- USAR COMPONENTE */}
            <Route path="/medicos" element={<Medicos />} />
            <Route path="/agendar" element={<Agendar />} />
            <Route path="/notificaciones" element={<Notificaciones />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;