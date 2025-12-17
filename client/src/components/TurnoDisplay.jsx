import { useState, useEffect } from 'react';
import MedicoService from '../services/medicoService';

const TurnoDisplay = ({ turnoId }) => {
  const [turno, setTurno] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (turnoId) {
      MedicoService.getTurnoById(turnoId)
        .then(data => {
          setTurno(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error cargando turno", err);
          setLoading(false);
        });
    }
  }, [turnoId]);

  if (loading) return <span className="text-xs text-gray-400">Cargando...</span>;
  if (!turno) return <span className="text-xs text-red-400">Error info</span>;

  return (
    <div>
      <div className="font-bold text-gray-800 text-lg">
        {turno.horaInicio ? turno.horaInicio.slice(0, 5) : 'N/A'}
      </div>
      <div className="text-sm text-gray-500">
        {turno.fecha}
      </div>
    </div>
  );
};

export default TurnoDisplay;