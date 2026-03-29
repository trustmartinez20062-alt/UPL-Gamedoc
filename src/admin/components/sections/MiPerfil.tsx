import { useState, useEffect } from "react";
import { User, Key, Save, Shield, Mail, CheckCircle2 } from "lucide-react";
import { getCurrentUser, updateNombre, changeMyPassword } from "../../auth";
import type { Usuario } from "../../store";
import PageHeader from "../PageHeader";
import { toast } from "sonner";

export default function MiPerfil() {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [form, setForm] = useState({ nombre: "", password: "" });

  const load = async () => {
    setLoading(true);
    const u = await getCurrentUser();
    if (u) {
      setUser(u);
      setForm({ nombre: u.nombre, password: "" });
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleUpdateNombre = async () => {
    if (!user || !form.nombre.trim()) return;
    setSaving(true);
    const ok = await updateNombre(user.id, form.nombre.trim());
    setSaving(false);
    if (ok) {
      toast.success("Nombre actualizado correctamente");
      await load();
    } else {
      toast.error("Error al actualizar el nombre");
    }
  };

  const handleChangePassword = async () => {
    if (!form.password.trim() || form.password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setSaving(true);
    const ok = await changeMyPassword(form.password);
    setSaving(false);
    if (ok) {
      toast.success("Contraseña actualizada correctamente");
      setForm({ ...form, password: "" });
    } else {
      toast.error("Error al cambiar la contraseña");
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

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2.5 opacity-40">
                Correo Electrónico
              </label>
              <div className="relative">
                <input
                  className="input-field pl-10 opacity-60 cursor-not-allowed"
                  value={user?.email}
                  disabled
                />
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2.5 opacity-40">
                Nombre de Usuario
              </label>
              <div className="relative">
                <input
                  className="input-field pl-10"
                  placeholder="Tu nombre de usuario"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value.toLowerCase().replace(/\s/g, '') })}
                />
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30" />
              </div>
            </div>

            <button
              onClick={handleUpdateNombre}
              disabled={saving || form.nombre === user?.nombre}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3"
            >
              <Save size={18} />
              Guardar Cambios
            </button>
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
                  className="input-field pl-10"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30" />
              </div>
            </div>

            <button
              onClick={handleChangePassword}
              disabled={saving || !form.password}
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
    </div>
  );
}
