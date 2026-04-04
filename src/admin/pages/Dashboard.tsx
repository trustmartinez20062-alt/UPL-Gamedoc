import { useState, useEffect } from "react";
import { Routes, Route, NavLink, useNavigate, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { logout, getCurrentUser } from "../auth";
import {
  Monitor, DollarSign, Wrench, Unlock, Gamepad2, Server, CreditCard,
  Phone, LogOut, Menu, X, ChevronRight, Users, User, ExternalLink
} from "lucide-react";

import ConsolasVenta from "../components/sections/ConsolasVenta";
import ConsolasCompra from "../components/sections/ConsolasCompra";
import Reparacion from "../components/sections/Reparacion";
import Destraba from "../components/sections/Destraba";
import Juegos from "../components/sections/Juegos";
import Plataformas from "../components/sections/Plataformas";
import GamePass from "../components/sections/GamePass";
import GamePassTypes from "../components/sections/GamePassTypes";
import Contacto from "../components/sections/Contacto";
import Usuarios from "../components/sections/Usuarios";
import MiPerfil from "../components/sections/MiPerfil";
import type { Usuario } from "../store";

const navItems = [
  { to: ".", label: "Consolas en Venta", icon: Monitor, end: true },
  { to: "compra", label: "Compra de Consolas", icon: DollarSign },
  { to: "reparacion", label: "Reparación", icon: Wrench },
  { to: "destraba", label: "Servicios", icon: Wrench },
  { to: "juegos", label: "Catálogo de Juegos", icon: Gamepad2 },
  { to: "plataformas", label: "Plataformas", icon: Server },
  { to: "gamepass", label: "Catálogo Game Pass", icon: CreditCard },
  { to: "gamepass-types", label: "Tipos de Game Pass", icon: Server },
  { to: "contacto", label: "Contacto", icon: Phone },
  { to: "usuarios", label: "Usuarios", icon: Users },
  { to: "perfil", label: "Mi Perfil", icon: User },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser().then(u => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const filteredNavItems = navItems.filter(item => {
    if (item.to === "usuarios" && user?.role !== "admin") return false;
    return true;
  });

  const handleLogout = async () => {
    await logout();
    navigate("/paneladmin/login", { replace: true });
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
            <div className="mt-1 flex flex-col items-start gap-1">
              <span 
                className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                  user?.role === 'admin' 
                    ? "bg-[hsl(175_80%_50%/0.15)] text-[hsl(175_80%_50%)] border border-[hsl(175_80%_50%/0.2)]" 
                    : "bg-[hsl(215_15%_18%)] text-[hsl(215_15%_55%)] border border-[hsl(215_15%_25%)]"
                }`}
              >
                {user?.role || "Cargando..."}
              </span>
              <div className="text-[10px] pl-0.5" style={{ color: "hsl(215 15% 45%)" }}>
                {user?.nombre}
              </div>
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

      {/* Footer Actions */}
      <div className="px-3 py-4 border-t space-y-1" style={{ borderColor: "hsl(220 15% 18%)" }}>
        <button
          onClick={() => navigate("/")}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
          style={{ color: "hsl(215 15% 70%)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "hsl(175 80% 50% / 0.1)";
            e.currentTarget.style.color = "hsl(175 80% 50%)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "hsl(215 15% 70%)";
          }}
        >
          <ExternalLink size={18} />
          Ir a la Tienda
        </button>

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "hsl(220 20% 6%)" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: "hsl(175 80% 50%) transparent" }} />
          <p className="text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "Orbitron, sans-serif", color: "hsl(215 15% 45%)" }}>
            Iniciando Panel...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "hsl(220 20% 6%)" }}>
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 border-r"
        style={{ background: "hsl(220 18% 8%)", borderColor: "hsl(220 15% 14%)" }}>
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            
            {/* Sidebar */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 bottom-0 w-72 flex flex-col border-r"
              style={{ background: "hsl(220 18% 8%)", borderColor: "hsl(220 15% 14%)" }}
            >
              <div className="flex justify-end p-4">
                <button onClick={() => setSidebarOpen(false)} style={{ color: "hsl(215 15% 55%)" }}>
                  <X size={22} />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

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
            <Route path="gamepass-types" element={<GamePassTypes />} />
            <Route path="contacto" element={<Contacto />} />
            <Route path="perfil" element={<MiPerfil />} />
            {user?.role === "admin" && <Route path="usuarios" element={<Usuarios />} />}
            {/* Si no es admin y trata de entrar a usuarios, redirigir a dashboard */}
            <Route path="usuarios" element={<Navigate to="/paneladmin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
