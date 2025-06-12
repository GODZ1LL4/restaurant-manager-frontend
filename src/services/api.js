import axios from "axios";


const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // ✅ esto es de CRA
});



//PERSONAS
export const getPersonas = () => API.get("/personas");
export const addPersona = (nombre) => API.post("/personas", { nombre });

// MENÚ
export const getMenu = () => API.get("/menu");
export const addMenuItem = (nombre, precio) =>
  API.post("/menu", { nombre, precio });

// PEDIDOS
export const getPedidos = async () => {
  const res = await API.get("/pedidos");
  return { data: res.data.pedidos ?? [] };
};

export const getPedidosPaginado = (limit, offset) =>
  API.get(`/pedidos?limit=${limit}&offset=${offset}`);
export const addPedido = (pedido) => API.post("/pedidos", pedido);
export const updatePedido = (id, data) => API.put(`/pedidos/${id}`, data);

// ESTADOS
export const getEstados = () => API.get("/estados");
export const addEstado = (descripcion) => API.post("/estados", { descripcion });

// PAGOS AL RESTAURANTE
export const getPagos = async () => {
  const res = await API.get("/pagos");
  return { data: res.data.pagos ?? [], total: res.data.total ?? 0 };
};

export const getPagosPaginado = (limit, offset) =>
  API.get(`/pagos?limit=${limit}&offset=${offset}`);

export const addPago = (pago) => API.post("/pagos", pago);
