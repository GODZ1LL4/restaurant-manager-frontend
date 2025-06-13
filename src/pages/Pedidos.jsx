import React, { useEffect, useState } from "react";
import {
  getPedidosPaginado,
  addPedido,
  getPersonas,
  getMenu,
  getEstados,
  updatePedido,
} from "../services/api";

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [menu, setMenu] = useState([]);
  const [estados, setEstados] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const [paginaActual, setPaginaActual] = useState(1);
  const porPagina = 10;
  const [totalPedidos, setTotalPedidos] = useState(0);
  const totalPaginas = Math.ceil(totalPedidos / porPagina);

  const [form, setForm] = useState({
    persona_id: "",
    menu_id: "",
    fecha: new Date().toISOString().split("T")[0],
    estado_id: "",
    nota: "",
    fecha_pago: "",
    monto_pagado: "",
  });

  const cargarPedidosPaginado = async () => {
    const offset = (paginaActual - 1) * porPagina;
    const [resPedidos, resPersonas, resMenu, resEstados] = await Promise.all([
      getPedidosPaginado(porPagina, offset),
      getPersonas(),
      getMenu(),
      getEstados(),
    ]);

    const pedidosData = resPedidos.data?.pedidos ?? [];
    const totalData = resPedidos.data?.total ?? 0;

    setPedidos(pedidosData);
    setTotalPedidos(totalData);
    setPersonas(resPersonas.data);
    setMenu(resMenu.data);
    setEstados(resEstados.data);
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    try {
      await addPedido({
        ...form,
        fecha_pago: form.fecha_pago || null,
      });

      setMensaje("✅ Pedido agregado");
      setForm({
        persona_id: "",
        menu_id: "",
        fecha: new Date().toISOString().split("T")[0],
        estado_id: "",
        nota: "",
        fecha_pago: "",
        monto_pagado: "",
      });
      cargarPedidosPaginado();
    } catch {
      setMensaje("❌ Error al agregar");
    }
    setTimeout(() => setMensaje(""), 2000);
  };

  useEffect(() => {
    cargarPedidosPaginado();
  }, [paginaActual]);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [formEditar, setFormEditar] = useState({
    estado_id: "",
    fecha_pago: "",
    monto_pagado: "",
  });

  const abrirModal = (pedido) => {
    setPedidoSeleccionado(pedido);
    setFormEditar({
      estado_id: pedido.estado_id || "",
      fecha_pago: pedido.fecha_pago || "",
      monto_pagado: pedido.monto_pagado || "",
    });
    setMostrarModal(true);
  };

  const guardarCambios = async () => {
    if (!pedidoSeleccionado) return;
    try {
      await updatePedido(pedidoSeleccionado.id, {
        ...formEditar,
        fecha_pago:
          formEditar.estado_id === "1"
            ? formEditar.fecha_pago || new Date().toISOString().split("T")[0]
            : null,
      });
      setMostrarModal(false);
      setPedidoSeleccionado(null);
      cargarPedidosPaginado();
    } catch (error) {
      console.error("Error actualizando pedido:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-xl font-bold text-center mb-4 text-indigo-700">
        🧾 Pedidos
      </h2>

      <form
        onSubmit={manejarSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
      >
        <select
          value={form.persona_id}
          onChange={(e) => setForm({ ...form, persona_id: e.target.value })}
          className="border rounded px-3 py-2"
          required
        >
          <option value="">Seleccionar persona</option>
          {personas.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>

        <select
          value={form.menu_id}
          onChange={(e) => setForm({ ...form, menu_id: e.target.value })}
          className="border rounded px-3 py-2"
          required
        >
          <option value="">Seleccionar menú</option>
          {menu.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nombre} (${m.precio})
            </option>
          ))}
        </select>

        <input
          type="date"
          value={form.fecha}
          onChange={(e) => setForm({ ...form, fecha: e.target.value })}
          className="border rounded px-3 py-2"
        />

        <select
          value={form.estado_id}
          onChange={(e) => {
            const nuevoEstado = e.target.value;
            setForm({
              ...form,
              estado_id: nuevoEstado,
              fecha_pago:
                nuevoEstado === "1"
                  ? new Date().toISOString().split("T")[0]
                  : "",
            });
          }}
          className="border rounded px-3 py-2"
          required
        >
          <option value="">Seleccionar estado</option>
          {estados.map((e) => (
            <option key={e.id} value={e.id}>
              {e.descripcion}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Nota (opcional)"
          value={form.nota}
          onChange={(e) => setForm({ ...form, nota: e.target.value })}
          className="border rounded px-3 py-2 col-span-full"
        />

        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 col-span-full"
        >
          Agregar Pedido
        </button>
      </form>

      {mensaje && (
        <div className="text-center text-sm text-green-600 mb-4">{mensaje}</div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b font-semibold text-gray-600">
              <th>Persona</th>
              <th>Menú</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Fecha Pago</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(pedidos) &&
              pedidos.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td>{p.persona?.nombre}</td>
                  <td>{p.menu?.nombre}</td>
                  <td>${p.menu?.precio?.toFixed(2)}</td>
                  <td>{p.estado?.descripcion}</td>
                  <td>{p.fecha}</td>
                  <td>{p.fecha_pago || "-"}</td>
                  <td>
                    <button
                      onClick={() => abrirModal(p)}
                      className="text-indigo-600 hover:underline"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {pedidos.length === 0 && (
        <div className="text-center text-gray-500 py-4">
          No hay pedidos para mostrar.
        </div>
      )}

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

      {mostrarModal && pedidoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-bold mb-4">Editar Pedido</h3>

            <div className="text-sm text-gray-700 mb-4 space-y-1">
              <p>
                <strong>Persona:</strong> {pedidoSeleccionado.persona?.nombre}
              </p>
              <p>
                <strong>Menú:</strong> {pedidoSeleccionado.menu?.nombre} ($
                {pedidoSeleccionado.menu?.precio.toFixed(2)})
              </p>
              <p>
                <strong>Nota:</strong> {pedidoSeleccionado.nota || "-"}
              </p>
              <p>
                <strong>Fecha del Pedido:</strong> {pedidoSeleccionado.fecha}
              </p>
            </div>

            <label className="block mb-2 text-sm font-medium">
              Estado del Pedido
            </label>
            <select
              value={formEditar.estado_id}
              onChange={(e) => {
                const nuevoEstado = e.target.value;
                setFormEditar((prev) => ({
                  ...prev,
                  estado_id: nuevoEstado,
                  fecha_pago:
                    nuevoEstado === "1"
                      ? new Date().toISOString().split("T")[0]
                      : "",
                }));
              }}
              className="w-full border rounded px-3 py-2 mb-4"
            >
              <option value="">Seleccionar estado</option>
              {estados.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.descripcion}
                </option>
              ))}
            </select>

            <label className="block mb-2 text-sm font-medium">
              Monto Pagado
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="Ej: 150.00"
              value={formEditar.monto_pagado}
              onChange={(e) =>
                setFormEditar({ ...formEditar, monto_pagado: e.target.value })
              }
              className="w-full border rounded px-3 py-2 mb-4"
            />

            {formEditar.fecha_pago && (
              <div className="text-sm text-green-700 mb-2">
                <strong>Fecha de pago:</strong> {formEditar.fecha_pago}
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setMostrarModal(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={guardarCambios}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pedidos;
