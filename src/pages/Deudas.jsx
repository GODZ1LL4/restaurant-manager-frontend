import React, { useEffect, useState } from 'react';
import { getPedidos } from '../services/api';

function Deudas() {
  const [deudas, setDeudas] = useState([]);

  useEffect(() => {
    const calcularDeudas = async () => {
      const res = await getPedidos();
      const pedidos = res.data;

      // Agrupar por persona, solo si estado es Pendiente
      const resumen = {};

      pedidos.forEach(p => {
        const estado = p.estado?.descripcion?.toLowerCase();
        const persona = p.persona?.nombre;
        const monto = p.menu?.precio || 0;

        if (estado === 'pendiente' && persona) {
          if (!resumen[persona]) resumen[persona] = 0;
          resumen[persona] += monto;
        }
      });

      // Convertir a array
      const resultado = Object.entries(resumen).map(([persona, total]) => ({
        persona,
        total
      }));

      setDeudas(resultado);
    };

    calcularDeudas();
  }, []);

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-xl font-bold text-center text-red-700 mb-4">💸 Deudas por Persona</h2>

      {deudas.length === 0 ? (
        <p className="text-center text-gray-500">No hay deudas registradas.</p>
      ) : (
        <ul className="divide-y">
          {deudas.map(d => (
            <li key={d.persona} className="py-2 px-2 flex justify-between hover:bg-gray-50 rounded">
              <span>{d.persona}</span>
              <span className="font-semibold text-gray-800">${d.total.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Deudas;
