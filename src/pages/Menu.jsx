import React, { useEffect, useState } from 'react';
import { getMenu, addMenuItem } from '../services/api';

function Menu() {
  const [menu, setMenu] = useState([]);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [mensaje, setMensaje] = useState('');

  const cargarMenu = async () => {
    const res = await getMenu();
    setMenu(res.data);
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !precio) return;
    try {
      await addMenuItem(nombre.trim(), parseFloat(precio));
      setMensaje('✅ Plato agregado');
      setNombre('');
      setPrecio('');
      cargarMenu();
    } catch {
      setMensaje('❌ Error al agregar plato');
    }
    setTimeout(() => setMensaje(''), 2000);
  };

  useEffect(() => {
    cargarMenu();
  }, []);

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-xl font-bold text-center mb-4 text-green-700">🍛 Menú</h2>

      <form onSubmit={manejarSubmit} className="flex flex-col gap-2 mb-4">
        <input
          type="text"
          placeholder="Nombre del plato"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <input
          type="number"
          step="0.01"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <button type="submit" className="bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Agregar
        </button>
      </form>

      {mensaje && <div className="text-sm text-center text-green-600 mb-2">{mensaje}</div>}

      <ul className="divide-y">
        {menu.map(item => (
          <li key={item.id} className="py-2 px-2 hover:bg-gray-50 rounded flex justify-between">
            <span>{item.nombre}</span>
            <span className="font-semibold text-gray-700">${item.precio.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Menu;
