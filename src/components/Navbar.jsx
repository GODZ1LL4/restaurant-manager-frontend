import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(!open);

  return (
    <nav className="bg-indigo-700 text-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <span className="text-xl font-bold">🍽️ Restaurant Manager</span>
        <button onClick={toggleMenu} className="md:hidden focus:outline-none">
          ☰
        </button>
        <div className="hidden md:flex gap-4 text-sm">
          <NavLinks />
        </div>
      </div>

      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-2 text-sm">
          <NavLinks onClick={() => setOpen(false)} />
        </div>
      )}
    </nav>
  );
}

function NavLinks({ onClick }) {
  const linkStyle = "hover:underline";

  return (
    <>
      <Link to="/" className={linkStyle} onClick={onClick}>Personas</Link>
      <Link to="/menu" className={linkStyle} onClick={onClick}>Menú</Link>
      <Link to="/pedidos" className={linkStyle} onClick={onClick}>Pedidos</Link>
      <Link to="/estados" className={linkStyle} onClick={onClick}>Estados</Link>
      <Link to="/deudas" className={linkStyle} onClick={onClick}>Deudas</Link>
      <Link to="/pagos" className={linkStyle} onClick={onClick}>Pagos</Link>
      <Link to="/deudas-restaurante" className={linkStyle} onClick={onClick}>Deuda Restaurante</Link>
    </>
  );
}

export default Navbar;
