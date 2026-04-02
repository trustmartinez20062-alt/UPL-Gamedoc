import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { changeMyPassword } from "../auth";
import { Eye, EyeOff, Gamepad2, Lock } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function UpdatePassword() {
  const navigate = useNavigate();
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Escuchar el cambio de autenticación para asegurar que el hash de recuperación 
    // se maneje y genere una sesión.
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === "PASSWORD_RECOVERY") {
        console.log("Sesión temporal de recuperación lista");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (pass.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    
    if (pass !== confirmPass) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    const ok = await changeMyPassword(pass);
    if (ok) {
      setSuccess("¡Contraseña actualizada exitosamente!");
      setTimeout(() => {
        navigate("/admin/login", { replace: true });
      }, 2000);
    } else {
      setError("Ocurrió un error al actualizar la contraseña o el enlace es inválido.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "hsl(220 20% 6%)" }}>

      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(175 80% 50%), transparent)" }} />

      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(hsl(175 80% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(175 80% 50%) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />

      <div className="relative z-10 w-full max-w-md px-6 animate-fade-in">
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
            Crear Nueva Contraseña
          </p>
        </div>

        <div className="rounded-2xl p-8 border"
          style={{
            background: "hsl(220 18% 10%)",
            borderColor: "hsl(220 15% 18%)",
            boxShadow: "0 25px 50px hsl(0 0% 0% / 0.5)"
          }}>
          <h2 className="text-xl font-bold text-center mb-6" style={{ fontFamily: "Orbitron, sans-serif", color: "hsl(210 20% 92%)" }}>
            Elige tu clave
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "hsl(215 15% 55%)" }}>
                Nueva Contraseña
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "hsl(215 15% 55%)" }} />
                <input
                  type={showPass ? "text" : "password"}
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="Seis caracteres mínimo"
                  className="input-field pl-12 pr-12"
                  required
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

            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "hsl(215 15% 55%)" }}>
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "hsl(215 15% 55%)" }} />
                <input
                  type={showPass ? "text" : "password"}
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Repetir contraseña"
                  className="input-field pl-12 pr-12"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm px-4 py-3 rounded-lg animate-fade-in"
                style={{ background: "hsl(0 84% 60% / 0.1)", border: "1px solid hsl(0 84% 60% / 0.25)", color: "hsl(0 84% 70%)" }}>
                <span>⚠️</span>
                {error}
              </div>
            )}
            
            {success && (
              <div className="flex items-center gap-2 text-sm px-4 py-3 rounded-lg animate-fade-in"
                style={{ background: "hsl(142 71% 45% / 0.1)", border: "1px solid hsl(142 71% 45% / 0.25)", color: "hsl(142 71% 45%)" }}>
                <span>✅</span>
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !!success}
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
                  Guardando...
                </span>
              ) : "Actualizar Contraseña"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
