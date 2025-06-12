import React, { useEffect, useState } from "react";
import { getPedidos, getPagos, getMenu } from "../services/api";

function DeudasRestaurante() {
  const [resumen, setResumen] = useState([]);
  const [totales, setTotales] = useState({ pendiente: 0, sinPago: 0 });

  useEffect(() => {
    const cargar = async () => {
      const [resPedidos, resPagos, resMenu] = await Promise.all([
        getPedidos(),
        getPagos(),
        getMenu(),
      ]);

      let pedidos = resPedidos.data;
      const pagos = resPagos.data;

      const agrupado = {};
      const idsUnicos = new Set();
      pedidos = pedidos.filter((p) => {
        const unico = !idsUnicos.has(p.id);
        idsUnicos.add(p.id);
        return unico;
      });

      for (const pedido of pedidos) {
        const semana = obtenerSemana(pedido.fecha);
        const precio = pedido.menu?.precio || 0;
        agrupado[semana] = (agrupado[semana] || 0) + precio;
      }

      for (const pago of pagos) {
        const semana = pago.codigo_semana;
        if (semana) {
          agrupado[semana] = (agrupado[semana] || 0) - parseFloat(pago.monto);
        }
      }

      const resumenFinal = Object.entries(agrupado)
        .map(([semana, saldo]) => ({ semana, saldo }))
        .sort((a, b) => b.semana.localeCompare(a.semana)); // DESC

      const totalPendiente = resumenFinal.reduce((acc, r) => acc + r.saldo, 0);

      const totalEstadoPendiente = pedidos
        .filter((p) => p.estado_id === 2)
        .reduce((acc, p) => acc + (p.menu?.precio || 0), 0);

      const totalSinPago = totalPendiente - totalEstadoPendiente;

      setResumen(resumenFinal);
      setTotales({
        pendiente: totalPendiente,
        sinPago: totalSinPago,
      });
    };

    cargar();
  }, []);

  // 🆕 Versión ISO 8601: semanas que empiezan en lunes
  const obtenerSemana = (fechaStr) => {
    const fecha = new Date(fechaStr);
    const dia = fecha.getUTCDay() || 7; // domingo = 7
    fecha.setUTCDate(fecha.getUTCDate() + 4 - dia);
    const inicioAno = new Date(Date.UTC(fecha.getUTCFullYear(), 0, 1));
    const semana = Math.ceil(((fecha - inicioAno) / 86400000 + 1) / 7);
    return `${fecha.getUTCFullYear()}-S${semana.toString().padStart(2, "0")}`;
  };

  const obtenerRangoSemana = (codigoSemana) => {
    const [anioStr, semanaStr] = codigoSemana.split("-S");
    const anio = parseInt(anioStr, 10);
    const semana = parseInt(semanaStr, 10);

    // ISO 8601: la semana 1 siempre contiene el 4 de enero
    const simple = new Date(anio, 0, 4);
    const diaSemana = (simple.getDay() + 6) % 7; // Ajusta para que lunes sea 0
    const lunes = new Date(simple);
    lunes.setDate(simple.getDate() - diaSemana + (semana - 1) * 7);

    const viernes = new Date(lunes);
    viernes.setDate(lunes.getDate() + 4);

    const formatear = (fecha) => fecha.toISOString().slice(0, 10); // YYYY-MM-DD

    return `${formatear(lunes)} a ${formatear(viernes)}`;
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold text-center text-indigo-700 mb-4">
        📅 Deudas al Restaurante por Semana
      </h2>
      {resumen.length > 0 && (
        <div className="mb-4 text-right text-indigo-800 space-y-1 font-semibold">
          <div>Total pendiente: ${totales.pendiente.toFixed(2)}</div>
          <div>Total sin pago: ${totales.sinPago.toFixed(2)}</div>
        </div>
      )}

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-indigo-100 font-semibold text-gray-700">
            <th className="text-left py-2 px-3">Semana</th>
            <th className="text-right py-2 px-3">Saldo</th>
          </tr>
        </thead>
        <tbody>
          {resumen.map((r, i) => (
            <tr key={i} className="border-t">
              <td className="py-2 px-3">
                <div className="font-semibold">{r.semana}</div>
                <div className="text-xs text-gray-500">
                  {obtenerRangoSemana(r.semana)}
                </div>
              </td>

              <td
                className={`py-2 px-3 text-right font-bold ${
                  r.saldo > 0 ? "text-red-600" : "text-green-600"
                }`}
              >
                ${r.saldo.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DeudasRestaurante;
