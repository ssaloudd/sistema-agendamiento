import { useState, useEffect } from 'react';
import NotificacionService from '../services/notificacionService';

const Notificaciones = () => {
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    cargarNotificaciones();
  }, []);

  const cargarNotificaciones = async () => {
    try {
      const data = await NotificacionService.getAll();
      setNotificaciones(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Buzón de Notificaciones (Simulador)</h2>
        <button 
          onClick={cargarNotificaciones}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Refrescar Buzón
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {notificaciones.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No hay notificaciones enviadas aún.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {notificaciones.map((n) => (
              <li key={n.id} className="p-4 hover:bg-blue-50 transition duration-150">
                <div className="flex justify-between">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full mb-2 inline-block
                    ${n.canal === 'EMAIL' ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800'}`}>
                    {n.canal}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(n.fechaEnvio).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">{n.asunto}</h4>
                    <p className="text-sm text-gray-600 mb-1">Para: <span className="font-mono text-blue-600">{n.destinatario}</span></p>
                    <p className="text-gray-700 mt-2 bg-gray-50 p-3 rounded border border-gray-100">
                      {n.cuerpoMensaje}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-green-600 border border-green-200 px-2 py-1 rounded">
                      {n.estado}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notificaciones;