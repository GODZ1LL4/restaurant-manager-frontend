import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

import Personas from './pages/Personas';
import Menu from './pages/Menu';
import Pedidos from './pages/Pedidos';
import Estados from './pages/Estados';
import Deudas from './pages/Deudas';
import Pagos from './pages/Pagos';
import DeudasRestaurante from './pages/DeudasRestaurante';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="p-4 bg-gray-100 min-h-screen">
        <Routes>
          <Route path="/" element={<Personas />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/estados" element={<Estados />} />
          <Route path="/deudas" element={<Deudas />} />
          <Route path="/pagos" element={<Pagos />} />
          <Route path="/deudas-restaurante" element={<DeudasRestaurante />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
