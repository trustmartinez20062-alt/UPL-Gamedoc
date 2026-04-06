import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginEmailPassword, sendPasswordResetEmail } from "../auth";
import { Eye, EyeOff, Gamepad2, Lock, Mail, ArrowLeft } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "recover">("login");

  // Anti-Brute Force variables
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);

  useEffect(() => {
    const checkLockout = () => {
      if (lockoutUntil && Date.now() > lockoutUntil) {
        setLockoutUntil(null);
        setFailedAttempts(0);
        setError("");
      } else if (lockoutUntil) {
        // Render triggers to update seconds
      }
    };
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutUntil && Date.now() < lockoutUntil) {
      setError(`Demasiados intentos fallidos. Intenta nuevamente en ${Math.ceil((lockoutUntil - Date.now()) / 1000)}s.`);
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    if (mode === "recover") {
      if (!user) {
        setError("Ingresa el correo de tu cuenta.");
        setLoading(false);
        return;
      }
      
      const ok = await sendPasswordResetEmail(user);
      if (ok) {
        setSuccess("Te enviamos un enlace especial a tu correo. Revisa tu buzón.");
      } else {
        setError("Error al solicitar el enlace. Verifica tu correo e intentalo nuevamente.");
      }
      setLoading(false);
      return;
    }

    if (mode === "login") {
      const result = await loginEmailPassword(user, pass);
      if (result.state === "success") {
        setFailedAttempts(0);
        navigate("/paneladmin", { replace: true });
        return;
      } else {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        if (newAttempts >= 3) {
          // Incremento exponencial: 15s -> 30s -> 60s
          const penalty = Math.pow(2, newAttempts - 3) * 15000;
          const lockoutTime = Date.now() + penalty;
          setLockoutUntil(lockoutTime);
          setError(`Se ha bloqueado temporalmente el acceso. Intenta en ${penalty / 1000}s.`);
        } else {
          setError(result.error || "Correo o contraseña incorrectos.");
        }
      }
      setLoading(false);
      return;
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
            {mode === "recover" ? "Recuperar Acceso" : "Iniciar Sesión"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Normal Login/Recover Mode */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "hsl(215 15% 55%)" }}>
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "hsl(215 15% 55%)" }} />
                <input
                  type="email"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="input-field !pl-12"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {mode === "login" && (
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
                    className="input-field !pl-12 !pr-12"
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
                <div className="mt-2 text-right">
                  <button 
                    type="button" 
                    onClick={() => { setMode("recover"); setError(""); setSuccess(""); }}
                    className="text-xs transition-colors hover:underline hover:text-primary"
                    style={{ color: "hsl(215 15% 55%)" }}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-sm px-4 py-3 rounded-lg animate-fade-in"
                style={{ background: "hsl(0 84% 60% / 0.1)", border: "1px solid hsl(0 84% 60% / 0.25)", color: "hsl(0 84% 70%)" }}>
                <span>⚠️</span>
                {error}
              </div>
            )}
            
            {/* Exito */}
            {success && (
              <div className="flex items-center gap-2 text-sm px-4 py-3 rounded-lg animate-fade-in"
                style={{ background: "hsl(142 71% 45% / 0.1)", border: "1px solid hsl(142 71% 45% / 0.25)", color: "hsl(142 71% 45%)" }}>
                <span>✅</span>
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !!lockoutUntil}
              className="w-full py-3 rounded-lg font-bold text-sm tracking-wide transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              style={{
                background: loading || !!lockoutUntil ? "hsl(175 80% 40%)" : "hsl(175 80% 50%)",
                color: "hsl(220 20% 6%)",
                fontFamily: "Orbitron, sans-serif",
                boxShadow: loading || !!lockoutUntil ? "none" : "0 0 20px hsl(175 80% 50% / 0.35)"
              }}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 rounded-full animate-spin"
                    style={{ borderColor: "hsl(220 20% 6%) transparent hsl(220 20% 6%) transparent" }} />
                  Procesando...
                </span>
              ) : !!lockoutUntil ? (
                `Bloqueado (${Math.ceil((lockoutUntil - Date.now()) / 1000)}s)`
              ) : mode === "recover" ? "Enviar Enlace Recup." : "Ingresar al Panel"}
            </button>
            
            {mode !== "login" && (
              <div className="text-center mt-2">
                <button 
                  type="button" 
                  onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
                  className="inline-flex items-center gap-2 text-xs transition-colors hover:text-primary"
                  style={{ color: "hsl(215 15% 55%)" }}
                >
                  <ArrowLeft size={14} /> Volver a Ingresar
                </button>
              </div>
            )}
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
