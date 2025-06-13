import React, { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleMenu = () => setOpen(!open);
  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  return (
    <nav className="text-black" style={{ backgroundColor: "#93DAFE" }}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <span className="text-xl font-bold">🤑 Deudas Manager</span>
        <button onClick={toggleMenu} className="md:hidden focus:outline-none font-bold">
          ☰
        </button>
        <div className="hidden md:flex gap-4 text-sm items-center relative font-bold">
          <Link to="/" className="hover:text-[#FF5F00] font-bold">
            Pedidos
          </Link>

          <div className="relative">
            <button
              onClick={() => toggleDropdown("contabilidad")}
              className="hover:text-[#FF5F00] font-bold"
            >
              Contabilidad ▾
            </button>
            {openDropdown === "contabilidad" && (
              <div className="absolute mt-2 rounded shadow-lg z-10 bg-[#6EC3E8] text-black">
                <Link
                  to="/deudas"
                  className="block px-4 py-2 hover:bg-[#FF5F00] hover:text-white font-bold"
                >
                  Deudas
                </Link>
                <Link
                  to="/deudas-restaurante"
                  className="block px-4 py-2 hover:bg-[#FF5F00] hover:text-white font-bold"
                >
                  Deuda Restaurante
                </Link>
                <Link
                  to="/pagos"
                  className="block px-4 py-2 hover:bg-[#FF5F00] hover:text-white font-bold"
                >
                  Pagos
                </Link>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => toggleDropdown("maestros")}
              className="hover:text-[#FF5F00] font-bold"
            >
              Maestros ▾
            </button>
            {openDropdown === "maestros" && (
              <div className="absolute mt-2 rounded shadow-lg z-10 bg-[#6EC3E8] text-black">
                <Link
                  to="/personas"
                  className="block px-4 py-2 hover:bg-[#FF5F00] hover:text-white font-bold"
                >
                  Clientes
                </Link>
                <Link
                  to="/estados"
                  className="block px-4 py-2 hover:bg-[#FF5F00] hover:text-white font-bold"
                >
                  Estados
                </Link>
                <Link
                  to="/menu"
                  className="block px-4 py-2 hover:bg-[#FF5F00] hover:text-white font-bold"
                >
                  Menú
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-2 text-sm text-black font-bold">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="hover:text-[#FF5F00] font-bold"
          >
            Pedidos
          </Link>
          <span className="font-bold">Contabilidad</span>
          <Link
            to="/deudas"
            onClick={() => setOpen(false)}
            className="pl-4 hover:text-[#FF5F00] font-bold"
          >
            Deudas
          </Link>
          <Link
            to="/deudas-restaurante"
            onClick={() => setOpen(false)}
            className="pl-4 hover:text-[#FF5F00] font-bold"
          >
            Deuda Restaurante
          </Link>
          <Link
            to="/pagos"
            onClick={() => setOpen(false)}
            className="pl-4 hover:text-[#FF5F00] font-bold"
          >
            Pagos
          </Link>
          <span className="font-bold">Maestros</span>
          <Link
            to="/personas"
            onClick={() => setOpen(false)}
            className="pl-4 hover:text-[#FF5F00] font-bold"
          >
            Clientes
          </Link>
          <Link
            to="/estados"
            onClick={() => setOpen(false)}
            className="pl-4 hover:text-[#FF5F00] font-bold"
          >
            Estados
          </Link>
          <Link
            to="/menu"
            onClick={() => setOpen(false)}
            className="pl-4 hover:text-[#FF5F00] font-bold"
          >
            Menú
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
