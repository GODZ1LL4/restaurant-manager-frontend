import React, { useEffect, useState } from "react";
import {
  getPagos,
  addPago,
  getPedidos,
  getMenu,
  getPagosPaginado,
} from "../services/api";

function Pagos() {
  const [paginaActual, setPaginaActual] = useState(1);
  const porPagina = 10;
  const [totalPagos, setTotalPagos] = useState(0);
  const totalPaginas = Math.ceil(totalPagos / porPagina);

  // ✅ Función ISO 8601 correcta
  const obtenerSemana = (fechaStr) => {
    const fecha = new Date(fechaStr);
    const dia = fecha.getUTCDay() || 7; // domingo = 7
    fecha.setUTCDate(fecha.getUTCDate() + 4 - dia);
    const inicioAno = new Date(Date.UTC(fecha.getUTCFullYear(), 0, 1));
    const semana = Math.ceil(((fecha - inicioAno) / 86400000 + 1) / 7);
    return `${fecha.getUTCFullYear()}-S${semana.toString().padStart(2, "0")}`;
  };

  const [semanasPendientes, setSemanasPendientes] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [form, setForm] = useState({
    fecha: new Date().toISOString().split("T")[0],
    monto: "",
    descripcion: "",
    codigo_semana: "",
  });
  const [mensaje, setMensaje] = useState("");

  // ✅ Carga los pagos
  const cargarPagos = async () => {
    const offset = (paginaActual - 1) * porPagina;
    const res = await getPagosPaginado(porPagina, offset);

    setPagos(res.data.pagos ?? []);
    setTotalPagos(res.data.total ?? 0);
  };

  // ✅ Calcula las semanas con deuda
  const calcularSemanasPendientes = async () => {
    const [resPedidos, resPagos] = await Promise.all([
      getPedidos(),
      getPagos(),
    ]);

    const pedidos = resPedidos.data;
    const pagos = resPagos.data;

    const deudaPorSemana = {};

    pedidos.forEach((p) => {
      const semana = obtenerSemana(p.fecha);
      const precio = p.menu?.precio || 0;
      deudaPorSemana[semana] = (deudaPorSemana[semana] || 0) + precio;
    });

    pagos.forEach((p) => {
      const semana = p.codigo_semana;
      if (semana) {
        deudaPorSemana[semana] =
          (deudaPorSemana[semana] || 0) - parseFloat(p.monto);
      }
    });

    const semanasConDeuda = Object.entries(deudaPorSemana)
      .filter(([_, saldo]) => saldo > 0)
      .map(([semana, saldo]) => ({ semana, saldo }))
      .sort((a, b) => a.semana.localeCompare(b.semana));

    setSemanasPendientes(semanasConDeuda);
  };

  // ✅ En montaje inicial
  useEffect(() => {
    calcularSemanasPendientes(); // no depende del paginado
    cargarPagos();
  }, [paginaActual]);

  // ✅ Al guardar un pago
  const manejarSubmit = async (e) => {
    e.preventDefault();
    try {
      await addPago({ ...form, monto: parseFloat(form.monto) });
      setMensaje("✅ Pago registrado");
      setForm({
        fecha: new Date().toISOString().split("T")[0],
        monto: "",
        descripcion: "",
        codigo_semana: "",
      });
      await cargarPagos(); // Actualiza listado
      await calcularSemanasPendientes(); // Actualiza select
    } catch {
      setMensaje("❌ Error al guardar el pago");
    }
    setTimeout(() => setMensaje(""), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-xl font-bold text-center text-amber-700 mb-4">
        💵 Pagos al Restaurante
      </h2>

      <form
        onSubmit={manejarSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4"
      >
        <input
          type="date"
          value={form.fecha}
          onChange={(e) => setForm({ ...form, fecha: e.target.value })}
          className="border rounded px-3 py-2"
          required
        />

        <select
          value={form.codigo_semana}
          onChange={(e) => setForm({ ...form, codigo_semana: e.target.value })}
          className="border rounded px-3 py-2 md:col-span-3"
          required
        >
          <option value="">Seleccionar semana</option>
          {semanasPendientes.map(({ semana, saldo }) => (
            <option key={semana} value={semana}>
              {semana} - ${saldo.toFixed(2)}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Monto"
          value={form.monto}
          onChange={(e) => setForm({ ...form, monto: e.target.value })}
          className="border rounded px-3 py-2"
          required
        />

        <input
          type="text"
          placeholder="Descripción (opcional)"
          value={form.descripcion}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          className="border rounded px-3 py-2 md:col-span-3"
        />

        <button
          type="submit"
          className="bg-amber-600 text-white py-2 rounded hover:bg-amber-700 col-span-full"
        >
          Registrar Pago
        </button>
      </form>

      {mensaje && (
        <div className="text-center text-sm text-green-600 mb-4">{mensaje}</div>
      )}

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b font-semibold text-gray-600">
            <th>Fecha</th>
            <th>Monto</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {pagos.map((p) => (
            <tr key={p.id} className="border-b hover:bg-gray-50">
              <td>{p.fecha}</td>
              <td>${p.monto.toFixed(2)}</td>
              <td>{p.descripcion || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 overflow-x-auto">
  <div className="flex flex-wrap justify-center items-center gap-2 text-sm w-full">
    <button
      onClick={() => setPaginaActual(1)}
      disabled={paginaActual === 1}
      className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center disabled:opacity-50"
      title="Primera"
    >
      ⏮
    </button>
    <button
      onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
      disabled={paginaActual === 1}
      className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center disabled:opacity-50"
      title="Anterior"
    >
      ←
    </button>
    <span className="text-gray-600 font-medium px-2 whitespace-nowrap">
      {paginaActual} / {totalPaginas || 1}
    </span>
    <button
      onClick={() =>
        setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))
      }
      disabled={paginaActual >= totalPaginas}
      className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center disabled:opacity-50"
      title="Siguiente"
    >
      →
    </button>
    <button
      onClick={() => setPaginaActual(totalPaginas)}
      disabled={paginaActual >= totalPaginas}
      className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center disabled:opacity-50"
      title="Última"
    >
      ⏭
    </button>
  </div>
</div>



    </div>
  );
}

export default Pagos;
