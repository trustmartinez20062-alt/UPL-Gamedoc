import { useState, useEffect } from "react";
import { User, Key, Save, Shield, Mail, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { getCurrentUser, updateUsuario, changeMyPassword, changeMyEmail, cancelEmailChange, logout } from "../../auth";
import type { Usuario } from "../../store";
import PageHeader from "../PageHeader";
import Modal from "../Modal";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

export default function MiPerfil() {
  const navigate = useNavigate();
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalType, setModalType] = useState<"password" | "email">("password");
  
  const [form, setForm] = useState({ nombre: "", email: "", password: "", confirmPassword: "" });

  const load = async () => {
    setLoading(true);
    const u = await getCurrentUser();
    if (u) {
      setUser(u);
      setForm({ nombre: u.nombre, email: u.email, password: "", confirmPassword: "" });
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleUpdateName = async () => {
    if (!user || !form.nombre.trim()) {
      toast.error("El nombre no puede estar vacío");
      return;
    }
    
    if (form.nombre.trim() === user.nombre) return;

    setSaving(true);
    const ok = await updateUsuario(user.id, form.nombre.trim(), user.email);
    setSaving(false);

    if (ok) {
      toast.success("Nombre de usuario actualizado correctamente");
      // Despachamos evento para que el Dashboard se entere sin cerrar sesión
      window.dispatchEvent(new CustomEvent("gd-profile-updated"));
      await load();
    } else {
      toast.error("Error al actualizar el nombre de usuario");
    }
  };

  const handleUpdateEmail = async () => {
    if (!user || !form.email.trim()) {
      toast.error("El correo electrónico no puede estar vacío");
      return;
    }
    
    if (form.email.trim() === user.email) return;

    setModalType("email");
    setShowConfirmModal(true);
  };

  const executeEmailChange = async () => {
    if (!user) return;
    
    setShowConfirmModal(false);
    setSaving(true);
    const result = await changeMyEmail(form.email.trim());
    
    if (result.ok) {
      toast.success("Enlaces enviados a ambos correos. Deberás validar ambos (Paso 1/2 y 2/2)");
      
      // Logout inmediato por seguridad (Opción A)
      setTimeout(async () => {
        await logout();
        navigate("/paneladmin/login", { replace: true });
      }, 2500);
    } else {
      setSaving(false);
      if (result.error?.toLowerCase().includes("rate limit") || result.error?.toLowerCase().includes("exceeded")) {
        toast.error("Límite de seguridad alcanzado (Spam protection). Por favor, intenta de nuevo en 60 minutos.");
      } else {
        toast.error("Error al procesar el cambio de correo.");
      }
    }
  };

  const handleChangePassword = async () => {
    if (!form.password.trim() || form.password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    
    // En lugar de ejecutar, mostramos el modal de confirmación
    setModalType("password");
    setShowConfirmModal(true);
  };

  const executePasswordChange = async () => {
    if (!user) return;
    
    setShowConfirmModal(false);
    setSaving(true);
    
    const ok = await updateUsuario(user.id, form.nombre, form.email, form.password);
    
    if (ok) {
      toast.success("Contraseña actualizada. Cerrando sesión por seguridad...");
      
      // Esperamos un momento para que el usuario vea el mensaje
      setTimeout(async () => {
        await logout();
        navigate("/paneladmin/login", { replace: true });
      }, 2000);
    } else {
      setSaving(false);
      toast.error("Error al cambiar la contraseña");
    }
  };

  const handleCancelEmailChange = async () => {
    if (!user) return;
    setSaving(true);
    // Llamamos a la función segura de RPC que borra el campo pending_email de auth.users
    const ok = await cancelEmailChange();
    setSaving(false);
    if (ok) {
      toast.success("Cambio de correo cancelado exitosamente.");
      // Limpiamos la form local y refrescamos los datos completos del user
      setForm(prev => ({ ...prev, email: user.email }));
      await load();
    } else {
      toast.error("Error al cancelar el cambio de correo.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: "hsl(175 80% 50%) transparent" }} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-4xl">
      <PageHeader
        icon={User}
        title="Mi Perfil"
        description="Gestiona tu información personal y seguridad"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Información General */}
        <div className="rounded-2xl border p-6 space-y-6"
          style={{ background: "hsl(220 18% 10%)", borderColor: "hsl(220 15% 18%)" }}>
          
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 rounded-2xl bg-[hsl(220_15%_15%)] flex items-center justify-center text-3xl font-bold text-[hsl(175_80%_50%)]">
              {user?.nombre.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-xl text-[hsl(210_20%_92%)]">{user?.nombre}</h3>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mt-1" 
                style={{ color: user?.role === 'admin' ? "hsl(175 80% 50%)" : "hsl(215 15% 45%)" }}>
                {user?.role === 'admin' ? <Shield size={12} /> : <User size={12} />}
                {user?.role}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Correo Electrónico Block */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2.5 opacity-40">
                  Correo Electrónico (Login)
                </label>
                <div className="relative">
                  <input
                    className="input-field !pl-10"
                    value={form.email}
                    disabled={!!user?.pendingEmail || user?.role !== 'admin'}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="ejemplo@correo.com"
                    style={user?.pendingEmail || user?.role !== 'admin' ? { borderColor: "hsl(175 80% 50% / 0.5)", color: "hsl(215 15% 50%)", cursor: "not-allowed" } : {}}
                  />
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30" />
                </div>
                
                {user?.role !== 'admin' && (
                  <p className="mt-2 text-[11px] opacity-70" style={{ color: "hsl(175 80% 60%)" }}>
                    Solo un administrador puede cambiar tu correo electrónico.
                  </p>
                )}
                
                {user?.pendingEmail && user?.role === 'admin' && (
                  <div className="mt-3 p-3 rounded-lg border flex flex-col gap-2" style={{ borderColor: "hsl(175 80% 50% / 0.3)", background: "hsl(175 80% 50% / 0.05)" }}>
                    <p className="text-xs" style={{ color: "hsl(175 80% 80%)" }}>
                      Verificación pendiente para: <strong className="text-white">{user.pendingEmail}</strong>.<br/>Revise la bandeja de entrada de ese correo.
                    </p>
                    <button 
                      onClick={handleCancelEmailChange}
                      disabled={saving}
                      className="text-xs font-bold py-1.5 px-3 rounded bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors self-start mt-1"
                    >
                      Cancelar solicitud
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={handleUpdateEmail}
                disabled={saving || form.email === user?.email || !!user?.pendingEmail || user?.role !== 'admin'}
                className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 text-sm"
              >
                <Save size={16} />
                Actualizar Correo
              </button>
            </div>

            <div className="h-px w-full" style={{ background: "hsl(0 0% 100% / 0.05)" }} />

            {/* Nombre Block */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2.5 opacity-40">
                  Nombre de Usuario
                </label>
                <div className="relative">
                  <input
                    className="input-field !pl-10"
                    placeholder="Tu nombre de usuario"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value.toLowerCase().replace(/\s/g, '') })}
                  />
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30" />
                </div>
              </div>
              <button
                onClick={handleUpdateName}
                disabled={saving || form.nombre === user?.nombre}
                className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 text-sm"
              >
                <Save size={16} />
                Actualizar Nombre
              </button>
            </div>
          </div>
        </div>

        {/* Seguridad */}
        <div className="rounded-2xl border p-6 space-y-6"
          style={{ background: "hsl(220 18% 10%)", borderColor: "hsl(220 15% 18%)" }}>
          
          <div>
            <h3 className="font-bold text-lg text-[hsl(210_20%_92%)] flex items-center gap-2">
              <Key size={20} className="text-[hsl(175_80%_50%)]" />
              Seguridad
            </h3>
            <p className="text-xs mt-1 opacity-50">Actualiza tu contraseña de acceso</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2.5 opacity-40">
                Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  className="input-field !pl-10 !pr-10"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2.5 opacity-40">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <input
                  className="input-field !pl-10 !pr-10"
                  type={showPassword ? "text" : "password"}
                  placeholder="Repite la nueva contraseña"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                />
                <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleChangePassword}
              disabled={saving || !form.password || !form.confirmPassword}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border font-bold text-sm transition-all hover:bg-[hsl(0_0%_100%/0.05)]"
              style={{ borderColor: "hsl(220 15% 20%)", color: "hsl(175 80% 50%)" }}
            >
              <CheckCircle2 size={18} />
              Actualizar Contraseña
            </button>

            <div className="p-4 rounded-xl text-[11px] leading-relaxed" 
              style={{ background: "hsl(175 80% 50% / 0.05)", border: "1px solid hsl(175 80% 50% / 0.15)", color: "hsl(175 80% 60%)" }}>
              <strong>Nota:</strong> Al cambiar tu contraseña, se actualizará inmediatamente para tu próximo inicio de sesión.
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación para Cambio de Contraseña / Email */}
      {showConfirmModal && (
        <Modal 
          title="Confirmar Cambio Seguro" 
          onClose={() => !saving && setShowConfirmModal(false)}
        >
          <div className="space-y-5">
            <div className="flex items-center gap-3 p-4 rounded-xl border bg-amber-500/10 border-amber-500/20 text-amber-200">
              <AlertTriangle className="shrink-0" size={24} />
              <p className="text-sm font-medium leading-relaxed">
                {modalType === "password" 
                  ? "Por seguridad, al cambiar tu contraseña se cerrará tu sesión actual y deberás ingresar nuevamente con tus nuevas credenciales."
                  : "Por seguridad, se enviará un mensaje de verificación a AMBOS correos (el actual y el nuevo). Deberás validar ambos enlaces para completar el cambio (Validación 1/2 y 2/2). La sesión se cerrará inmediatamente."}
              </p>
            </div>
            
            <p className="text-[hsl(215_15%_70%)] text-sm">
              ¿Estás seguro de que deseas actualizar tu {modalType === "password" ? "contraseña" : "correo electrónico"} ahora?
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 rounded-lg border font-bold text-xs uppercase tracking-wider transition-all hover:bg-white/5"
                style={{ borderColor: "hsl(220 15% 20%)", color: "hsl(215 15% 55%)" }}
              >
                Cancelar
              </button>
              <button
                onClick={modalType === "password" ? executePasswordChange : executeEmailChange}
                className="flex-1 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all"
                style={{ 
                  background: "hsl(175 80% 50%)", 
                  color: "hsl(220 20% 6%)",
                  boxShadow: "0 0 20px hsl(175 80% 50% / 0.2)"
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
