import React, { useEffect, useState } from 'react';
import { getEstados, addEstado } from '../services/api';

function Estados() {
  const [estados, setEstados] = useState([]);
  const [descripcion, setDescripcion] = useState('');
  const [mensaje, setMensaje] = useState('');

  const cargarEstados = async () => {
    const res = await getEstados();
    setEstados(res.data);
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    if (!descripcion.trim()) return;
    try {
      await addEstado(descripcion.trim());
      setMensaje('✅ Estado agregado');
      setDescripcion('');
      cargarEstados();
    } catch {
      setMensaje('❌ Error al agregar estado');
    }
    setTimeout(() => setMensaje(''), 2000);
  };

  useEffect(() => {
    cargarEstados();
  }, []);

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-xl font-bold text-center mb-4 text-purple-700">📌 Estados</h2>

      <form onSubmit={manejarSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Descripción del estado"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
        />
        <button type="submit" className="bg-purple-600 text-white px-4 rounded hover:bg-purple-700">
          Agregar
        </button>
      </form>

      {mensaje && <div className="text-sm text-center text-green-600 mb-2">{mensaje}</div>}

      <ul className="divide-y">
        {estados.map(est => (
          <li key={est.id} className="py-2 px-2 hover:bg-gray-50 rounded">{est.descripcion}</li>
        ))}
      </ul>
    </div>
  );
}

export default Estados;
