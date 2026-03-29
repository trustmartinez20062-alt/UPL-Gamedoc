import { useState, useEffect } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { logout, getCurrentUser } from "../auth";
import {
  Monitor, DollarSign, Wrench, Unlock, Gamepad2, Server, CreditCard,
  Phone, LogOut, Menu, X, ChevronRight, Users
} from "lucide-react";

import ConsolasVenta from "../components/sections/ConsolasVenta";
import ConsolasCompra from "../components/sections/ConsolasCompra";
import Reparacion from "../components/sections/Reparacion";
import Destraba from "../components/sections/Destraba";
import Juegos from "../components/sections/Juegos";
import Plataformas from "../components/sections/Plataformas";
import GamePass from "../components/sections/GamePass";
import Contacto from "../components/sections/Contacto";
import Usuarios from "../components/sections/Usuarios";

const navItems = [
  { to: ".", label: "Consolas en Venta", icon: Monitor, end: true },
  { to: "compra", label: "Compra de Consolas", icon: DollarSign },
  { to: "reparacion", label: "Reparación", icon: Wrench },
  { to: "destraba", label: "Destraba", icon: Unlock },
  { to: "juegos", label: "Catálogo de Juegos", icon: Gamepad2 },
  { to: "plataformas", label: "Plataformas", icon: Server },
  { to: "gamepass", label: "Game Pass", icon: CreditCard },
  { to: "contacto", label: "Contacto", icon: Phone },
  { to: "usuarios", label: "Usuarios", icon: Users },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ nombre: string; role: string } | null>(null);

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  const filteredNavItems = navItems.filter(item => {
    if (item.to === "usuarios" && user?.role !== "admin") return false;
    return true;
  });

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  const activeLinkStyle = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
      isActive
        ? "sidebar-item-active"
        : "text-[hsl(215_15%_55%)] hover:text-[hsl(210_20%_92%)] hover:bg-[hsl(220_15%_14%)]"
    }`;

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-4 py-6 border-b" style={{ borderColor: "hsl(220 15% 18%)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "hsl(175 80% 50% / 0.15)", border: "1px solid hsl(175 80% 50% / 0.3)" }}>
            <Gamepad2 size={22} style={{ color: "hsl(175 80% 50%)" }} />
          </div>
          <div>
            <div className="font-bold text-sm text-glow" style={{ fontFamily: "Orbitron, sans-serif", color: "hsl(175 80% 50%)" }}>
              GAME DOCTOR
            </div>
            <div className="text-[10px] flex items-center gap-1.5" style={{ color: "hsl(215 15% 45%)" }}>
              <span className="uppercase font-bold" style={{ color: user?.role === 'admin' ? 'hsl(175 80% 50%)' : 'inherit' }}>
                {user?.role}
              </span> 
              • {user?.nombre}
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold uppercase tracking-wider px-3 mb-3" style={{ color: "hsl(215 15% 38%)" }}>
          Secciones
        </p>
        {filteredNavItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={activeLinkStyle}
            onClick={() => setSidebarOpen(false)}
          >
            <Icon size={18} className="shrink-0" />
            <span className="flex-1">{label}</span>
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t" style={{ borderColor: "hsl(220 15% 18%)" }}>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
          style={{ color: "hsl(0 84% 65%)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(0 84% 60% / 0.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <LogOut size={18} />
          Cerrar Sesión
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "hsl(220 20% 6%)" }}>
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 border-r"
        style={{ background: "hsl(220 18% 8%)", borderColor: "hsl(220 15% 14%)" }}>
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 flex flex-col border-r animate-slide-in"
            style={{ background: "hsl(220 18% 8%)", borderColor: "hsl(220 15% 14%)" }}>
            <div className="flex justify-end p-4">
              <button onClick={() => setSidebarOpen(false)} style={{ color: "hsl(215 15% 55%)" }}>
                <X size={22} />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b"
          style={{ background: "hsl(220 18% 8%)", borderColor: "hsl(220 15% 14%)" }}>
          <button onClick={() => setSidebarOpen(true)} style={{ color: "hsl(175 80% 50%)" }}>
            <Menu size={24} />
          </button>
          <span className="font-bold text-sm" style={{ fontFamily: "Orbitron, sans-serif", color: "hsl(175 80% 50%)" }}>
            GAME DOCTOR
          </span>
          <div className="w-6" />
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route index element={<ConsolasVenta />} />
            <Route path="compra" element={<ConsolasCompra />} />
            <Route path="reparacion" element={<Reparacion />} />
            <Route path="destraba" element={<Destraba />} />
            <Route path="juegos" element={<Juegos />} />
            <Route path="plataformas" element={<Plataformas />} />
            <Route path="gamepass" element={<GamePass />} />
            <Route path="contacto" element={<Contacto />} />
            <Route path="usuarios" element={<Usuarios />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
