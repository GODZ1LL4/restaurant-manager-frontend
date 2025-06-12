import React, { useEffect, useState } from 'react';
import { getPersonas, addPersona } from '../services/api';

function Personas() {
  const [personas, setPersonas] = useState([]);
  const [nuevaPersona, setNuevaPersona] = useState('');
  const [mensaje, setMensaje] = useState('');

  const cargarPersonas = async () => {
    const response = await getPersonas();
    setPersonas(response.data);
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    if (!nuevaPersona.trim()) return;

    try {
      await addPersona(nuevaPersona.trim());
      setMensaje('✅ Persona agregada');
      setNuevaPersona('');
      cargarPersonas();
    } catch {
      setMensaje('❌ Error al agregar');
    }

    setTimeout(() => setMensaje(''), 2000);
  };

  useEffect(() => {
    cargarPersonas();
  }, []);

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-xl font-bold text-center mb-4 text-blue-700">👤 Lista de Personas</h2>

      <form onSubmit={manejarSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Nombre"
          value={nuevaPersona}
          onChange={(e) => setNuevaPersona(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700">
          Agregar
        </button>
      </form>

      {mensaje && <div className="text-sm text-center mb-2 text-green-600">{mensaje}</div>}

      <ul className="divide-y">
        {personas.map((p) => (
          <li key={p.id} className="py-2 px-2 hover:bg-gray-50 rounded">{p.nombre}</li>
        ))}
      </ul>
    </div>
  );
}

export default Personas;
