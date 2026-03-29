import { useState, useEffect } from "react";
import { Users, Plus, Trash2, Shield, User, Key, AlertCircle, RefreshCw, Edit2, Mail } from "lucide-react";
import { getCurrentUser, fetchUsuarios, createUsuario, deleteUsuario, updateUsuario, adminChangePassword } from "../../auth";
import type { Usuario } from "../../store";
import Modal from "../Modal";
import PageHeader from "../PageHeader";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [form, setForm] = useState({ nombre: "", email: "", password: "", role: "subadmin" as "admin" | "subadmin" });
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const load = async () => {
    setLoading(true);
    const [cu, lista] = await Promise.all([getCurrentUser(), fetchUsuarios()]);
    setCurrentUser(cu);
    setUsuarios(lista);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  if (!loading && currentUser?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle size={48} className="text-red-500 mb-4 opacity-50" />
        <h2 className="text-xl font-bold text-white mb-2">Acceso Restringido</h2>
        <p className="text-[hsl(215_15%_55%)]">Solo los administradores pueden gestionar usuarios.</p>
      </div>
    );
  }

  const filtered = usuarios.filter(u => u.nombre.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => {
    setForm({ nombre: "", email: "", password: "", role: "subadmin" });
    setErrorMsg("");
    setModal("add");
  };

  const openEdit = (u: Usuario) => {
    setSelectedUser(u);
    setForm({ nombre: u.nombre, email: u.email, password: "", role: u.role });
    setErrorMsg("");
    setModal("edit");
  };

  const handleSave = async () => {
    if (!form.nombre.trim() || !form.email.trim() || !form.password.trim()) {
      setErrorMsg("Todos los campos son obligatorios.");
      return;
    }
    setSaving(true);
    setErrorMsg("");
    const ok = await createUsuario(form.nombre.trim(), form.email.trim(), form.password, form.role);
    setSaving(false);
    if (ok) {
      setModal(null);
      await load();
    } else {
      setErrorMsg("Error al crear el usuario. Revisa la consola.");
    }
  };

  const handleEdit = async () => {
    if (!selectedUser || !form.nombre.trim() || !form.email.trim()) return;
    setSaving(true);
    setErrorMsg("");

    const ok = await updateUsuario(
      selectedUser.id, 
      form.nombre.trim(), 
      form.email.trim(),
      form.password.trim() || undefined
    );

    setSaving(false);
    if (ok) {
      setModal(null);
      await load();
    } else {
      setErrorMsg("Error al actualizar el usuario. Revisa la consola.");
    }
  };

  const handleDelete = async (u: Usuario) => {
    if (u.id === currentUser?.id) { alert("No puedes eliminarte a ti mismo."); return; }
    if (usuarios.length <= 1) { alert("Debe haber al menos un usuario."); return; }
    if (!confirm(`¿Eliminar al usuario "${u.nombre}"?`)) return;
    await deleteUsuario(u.id);
    await load();
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        icon={Users}
        title="Gestión de Accesos"
        description={`${usuarios.length} usuarios con acceso al panel`}
        action={
          <div className="flex gap-2">
            <button onClick={load} className="p-2.5 rounded-xl border transition-all hover:bg-[hsl(220_15%_14%)]" style={{ borderColor: "hsl(220 15% 20%)", color: "hsl(215 15% 55%)" }}>
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
              <Plus size={16} /> Nuevo Usuario
            </button>
          </div>
        }
      />

      <div className="mb-6">
        <div className="relative max-w-sm">
          <input
            className="input-field pl-10"
            placeholder="Buscar por nombre de usuario..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: "hsl(175 80% 50%) transparent" }} />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((u) => (
            <div key={u.id} className="rounded-2xl border p-5 transition-all duration-300 group relative overflow-hidden"
              style={{ background: "hsl(220 18% 10%)", borderColor: "hsl(220 15% 18%)", boxShadow: "0 10px 30px -15px rgba(0,0,0,0.5)" }}>

              <div className={`absolute top-0 right-0 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-bl-2xl flex items-center gap-1.5 ${
                u.role === "admin" ? "bg-[hsl(175_80%_50%/0.15)] text-[hsl(175_80%_50%)]" : "bg-[hsl(215_15%_18%)] text-[hsl(215_15%_60%)]"
              }`}>
                {u.role === "admin" ? <Shield size={10} /> : <User size={10} />}
                {u.role}
              </div>

              <div className="mb-5 pt-2">
                <h3 className="font-bold text-lg text-[hsl(210_20%_92%)] mb-2 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[hsl(220_15%_15%)] flex items-center justify-center text-[hsl(175_80%_50%)]">
                    {u.nombre.charAt(0).toUpperCase()}
                  </div>
                  {u.nombre}
                </h3>
                <div className="flex items-center gap-2 text-xs" style={{ color: "hsl(215 15% 45%)" }}>
                  <Mail size={12} className="shrink-0" />
                  <span className="truncate">{u.email}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t" style={{ borderColor: "hsl(220 15% 15%)" }}>
                <button
                  onClick={() => openEdit(u)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all hover:bg-[hsl(220_15%_14%)] text-[hsl(215_15%_55%)]"
                >
                  <Edit2 size={14} /> Editar
                </button>
                <button
                  onClick={() => handleDelete(u)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all hover:bg-[hsl(0_84%_60%/0.1)] text-[hsl(0_84%_70%)]"
                  disabled={u.id === currentUser?.id}
                >
                  <Trash2 size={14} /> Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal === "add" && (
        <Modal title="Crear Nuevo Usuario" onClose={() => setModal(null)}>
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: "hsl(215 15% 50%)" }}>
                Nombre / Nick
              </label>
              <div className="relative">
                <input
                  className="input-field pl-10"
                  placeholder="Ej: santiago"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  autoFocus
                />
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: "hsl(215 15% 50%)" }}>
                Correo Electrónico (Login)
              </label>
              <div className="relative">
                <input
                  className="input-field pl-10"
                  placeholder="ejemplo@correo.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: "hsl(215 15% 50%)" }}>
                Contraseña (mín. 6 caracteres)
              </label>
              <div className="relative">
                <input
                  className="input-field pl-10"
                  type="text"
                  placeholder="Contraseña segura"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "hsl(215 15% 50%)" }}>
                Nivel de Acceso
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(["subadmin", "admin"] as const).map((r) => (
                  <button key={r} onClick={() => setForm({ ...form, role: r })}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                      form.role === r
                        ? "border-[hsl(175_80%_50%/0.4)] bg-[hsl(175_80%_50%/0.08)] text-[hsl(175_80%_50%)]"
                        : "border-[hsl(220_15%_18%)] bg-[hsl(220_15%_10%)] text-[hsl(215_15%_45%)]"
                    }`}>
                    {r === "admin" ? <Shield size={20} /> : <User size={20} />}
                    <div className="text-center">
                      <div className="text-xs font-bold uppercase">{r}</div>
                      <div className="text-[9px] opacity-60">{r === "admin" ? "Control total" : "Solo contenidos"}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {errorMsg && (
              <div className="text-xs px-3 py-2 rounded-lg" style={{ background: "hsl(0 84% 60% / 0.1)", border: "1px solid hsl(0 84% 60% / 0.25)", color: "hsl(0 84% 70%)" }}>
                {errorMsg}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button onClick={() => setModal(null)} className="flex-1 py-3.5 rounded-2xl font-bold transition-all hover:bg-[hsl(220_15%_14%)] text-[hsl(215_15%_50%)]">
                Cancelar
              </button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 py-3.5 rounded-2xl text-sm">
                {saving ? "Creando..." : "Crear Usuario"}
              </button>
            </div>
          </div>
        </Modal>
      )}
      {modal === "edit" && selectedUser && (
        <Modal title={`Editar Usuario: ${selectedUser.nombre}`} onClose={() => setModal(null)}>
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: "hsl(215 15% 50%)" }}>
                Nombre de Usuario
              </label>
              <div className="relative">
                <input
                  className="input-field pl-10"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                />
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: "hsl(215 15% 50%)" }}>
                Correo Electrónico
              </label>
              <div className="relative">
                <input
                  className="input-field pl-10"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: "hsl(215 15% 50%)" }}>
                Nueva Contraseña (dejar vacío para no cambiar)
              </label>
              <div className="relative">
                <input
                  className="input-field pl-10"
                  type="text"
                  placeholder="Nueva contraseña segura"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30" />
              </div>
            </div>

            {errorMsg && (
              <div className="text-xs px-3 py-2 rounded-lg" style={{ background: "hsl(0 84% 60% / 0.1)", border: "1px solid hsl(0 84% 60% / 0.25)", color: "hsl(0 84% 70%)" }}>
                {errorMsg}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button onClick={() => setModal(null)} className="flex-1 py-3.5 rounded-2xl font-bold transition-all hover:bg-[hsl(220_15%_14%)] text-[hsl(215_15%_50%)]">
                Cancelar
              </button>
              <button onClick={handleEdit} disabled={saving} className="btn-primary flex-1 py-3.5 rounded-2xl text-sm">
                {saving ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
