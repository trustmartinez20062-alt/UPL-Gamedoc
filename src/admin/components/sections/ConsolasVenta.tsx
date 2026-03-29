import { useState } from "react";
import { Monitor, Plus, Pencil, Trash2 } from "lucide-react";
import { useConsolasVenta, genId, type ConsolaVenta } from "../../store";
import Modal from "../Modal";
import PageHeader from "../PageHeader";

export default function ConsolasVenta() {
  const [consolas, setConsolas] = useConsolasVenta();
  const [modal, setModal] = useState<{ mode: "add" | "edit"; item?: ConsolaVenta } | null>(null);
  const [form, setForm] = useState<Omit<ConsolaVenta, "id">>({ name: "", badge: "Disponible", image: "" });

  const openAdd = () => {
    setForm({ name: "", badge: "Disponible", image: "" });
    setModal({ mode: "add" });
  };

  const openEdit = (item: ConsolaVenta) => {
    setForm({ name: item.name, badge: item.badge, image: item.image });
    setModal({ mode: "edit", item });
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (modal?.mode === "add") {
      setConsolas((prev) => [...prev, { id: genId(), ...form }]);
    } else if (modal?.item) {
      setConsolas((prev) =>
        prev.map((c) => (c.id === modal.item!.id ? { ...c, ...form } : c))
      );
    }
    setModal(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Eliminar esta consola?")) {
      setConsolas((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        icon={Monitor}
        title="Consolas en Venta"
        description={`${consolas.length} consolas registradas`}
        action={
          <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={16} /> Agregar Consola
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {consolas.map((c) => (
          <div
            key={c.id}
            className="relative rounded-xl border p-5 transition-all duration-200 group"
            style={{
              background: "hsl(220 18% 10%)",
              borderColor: "hsl(220 15% 18%)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "hsl(175 80% 50% / 0.35)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "hsl(220 15% 18%)";
            }}
          >
            {/* Badge */}
            <span className={c.badge === "Disponible" ? "badge-available" : "badge-unavailable"}>
              {c.badge}
            </span>

            <div className="mt-3 text-center">
              <div className="aspect-video w-full overflow-hidden rounded-md mb-3">
                <img src={c.image} alt={c.name} className="h-full w-full object-cover" />
              </div>
              <h3 className="font-semibold text-sm" style={{ color: "hsl(210 20% 92%)" }}>
                {c.name}
              </h3>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => openEdit(c)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all"
                style={{ background: "hsl(220 15% 16%)", color: "hsl(215 15% 70%)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "hsl(220 15% 20%)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "hsl(220 15% 16%)")}
              >
                <Pencil size={13} /> Editar
              </button>
              <button
                onClick={() => handleDelete(c.id)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
                style={{ background: "hsl(0 84% 60% / 0.1)", color: "hsl(0 84% 70%)", border: "1px solid hsl(0 84% 60% / 0.2)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "hsl(0 84% 60% / 0.2)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "hsl(0 84% 60% / 0.1)")}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <Modal
          title={modal.mode === "add" ? "Agregar Consola" : "Editar Consola"}
          onClose={() => setModal(null)}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "hsl(215 15% 55%)" }}>
                Nombre
              </label>
              <input
                className="input-field"
                placeholder="Ej: PlayStation 5 Slim"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "hsl(215 15% 55%)" }}>
                Estado
              </label>
              <select
                className="input-field"
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value as "Disponible" | "Agotado" })}
              >
                <option value="Disponible">Disponible</option>
                <option value="Agotado">Agotado</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "hsl(215 15% 55%)" }}>
                URL de Imagen
              </label>
              <input
                className="input-field"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
              {form.image && (
                <div className="mt-2 aspect-video w-full max-w-[200px] overflow-hidden rounded-md border" style={{ borderColor: 'hsl(220 15% 22%)' }}>
                  <img src={form.image} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="btn-ghost flex-1 text-sm">
                Cancelar
              </button>
              <button onClick={handleSave} className="btn-primary flex-1 text-sm">
                {modal.mode === "add" ? "Agregar" : "Guardar"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
