import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../auth";
import { Eye, EyeOff, Gamepad2, Lock, User } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const ok = await login(user, pass);
    if (ok) {
      navigate("/admin", { replace: true });
    } else {
      setError("Usuario o contraseña incorrectos.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "hsl(220 20% 6%)" }}>

      {/* Background glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(175 80% 50%), transparent)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-8 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(260 70% 60%), transparent)" }} />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(hsl(175 80% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(175 80% 50%) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />

      <div className="relative z-10 w-full max-w-md px-6 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-5 border"
            style={{
              background: "linear-gradient(135deg, hsl(175 80% 50% / 0.15), hsl(175 80% 50% / 0.05))",
              borderColor: "hsl(175 80% 50% / 0.3)",
              boxShadow: "0 0 40px hsl(175 80% 50% / 0.2)"
            }}>
            <Gamepad2 size={40} style={{ color: "hsl(175 80% 50%)" }} />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-glow" style={{ fontFamily: "Orbitron, sans-serif", color: "hsl(175 80% 50%)" }}>
            GAME DOCTOR
          </h1>
          <p className="text-sm" style={{ color: "hsl(215 15% 55%)" }}>
            Panel de Administración
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8 border"
          style={{
            background: "hsl(220 18% 10%)",
            borderColor: "hsl(220 15% 18%)",
            boxShadow: "0 25px 50px hsl(0 0% 0% / 0.5)"
          }}>
          <h2 className="text-xl font-bold text-center mb-6" style={{ fontFamily: "Orbitron, sans-serif", color: "hsl(210 20% 92%)" }}>
            Iniciar Sesión
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Usuario */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "hsl(215 15% 55%)" }}>
                Usuario
              </label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "hsl(215 15% 55%)" }} />
                <input
                  type="text"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  placeholder="Ingresá tu usuario"
                  className="input-field pl-12"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "hsl(215 15% 55%)" }}>
                Contraseña
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "hsl(215 15% 55%)" }} />
                <input
                  type={showPass ? "text" : "password"}
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="Ingresá tu contraseña"
                  className="input-field pl-12 pr-12"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
                  style={{ color: "hsl(215 15% 55%)" }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-sm px-4 py-3 rounded-lg animate-fade-in"
                style={{ background: "hsl(0 84% 60% / 0.1)", border: "1px solid hsl(0 84% 60% / 0.25)", color: "hsl(0 84% 70%)" }}>
                <span>⚠️</span>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold text-sm tracking-wide transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              style={{
                background: loading ? "hsl(175 80% 40%)" : "hsl(175 80% 50%)",
                color: "hsl(220 20% 6%)",
                fontFamily: "Orbitron, sans-serif",
                boxShadow: loading ? "none" : "0 0 20px hsl(175 80% 50% / 0.35)"
              }}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 rounded-full animate-spin"
                    style={{ borderColor: "hsl(220 20% 6%) transparent hsl(220 20% 6%) transparent" }} />
                  Verificando...
                </span>
              ) : "Ingresar al Panel"}
            </button>
          </form>
        </div>

        <div className="text-center mt-6 flex flex-col items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="text-xs py-2 px-4 rounded-lg border transition-all duration-200 flex items-center gap-2 group"
            style={{ 
              borderColor: "hsl(220 15% 18%)", 
              background: "hsl(220 18% 10%)",
              color: "hsl(215 15% 55%)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "hsl(175 80% 50% / 0.4)";
              e.currentTarget.style.color = "hsl(175 80% 50%)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "hsl(220 15% 18%)";
              e.currentTarget.style.color = "hsl(215 15% 55%)";
            }}
          >
            Volver al inicio
          </button>
          
          <p className="text-xs" style={{ color: "hsl(215 15% 35%)" }}>
            © {new Date().getFullYear()} Game Doctor UY — Administración interna
          </p>
        </div>
      </div>
    </div>
  );
}
