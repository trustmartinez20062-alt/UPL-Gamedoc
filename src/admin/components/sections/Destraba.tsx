import { useState } from "react";
import { Unlock, Plus, Pencil, Trash2 } from "lucide-react";
import { useDestraba, genId, type DestrabaModelo } from "../../store";
import { useAuth } from "../../hooks/useAuth";
import Modal from "../Modal";
import PageHeader from "../PageHeader";

export default function Destraba() {
  const [modelos, setModelos] = useDestraba();
  const { user } = useAuth();
  const [modal, setModal] = useState<{ mode: "add" | "edit"; item?: DestrabaModelo } | null>(null);
  const [form, setForm] = useState<Omit<DestrabaModelo, "id">>({ modelo: "", precio: "" });

  const openAdd = () => {
    setForm({ modelo: "", precio: "" });
    setModal({ mode: "add" });
  };

  const openEdit = (item: DestrabaModelo) => {
    setForm({ modelo: item.modelo, precio: item.precio });
    setModal({ mode: "edit", item });
  };

  const handleSave = () => {
    if (!form.modelo.trim()) return;
    if (modal?.mode === "add") {
      setModelos((prev) => [...prev, { id: genId(), ...form }]);
    } else if (modal?.item) {
      setModelos((prev) =>
        prev.map((m) => (m.id === modal.item!.id ? { ...m, ...form } : m))
      );
    }
    setModal(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Eliminar este modelo?")) {
      setModelos((prev) => prev.filter((m) => m.id !== id));
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        icon={Unlock}
        title="Destraba de Consolas"
        description={`${modelos.length} modelos con precio de destraba`}
        action={
          <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={16} /> Agregar
          </button>
        }
      />

      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "hsl(220 15% 18%)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "hsl(220 15% 12%)" }}>
              <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider"
                style={{ color: "hsl(215 15% 55%)", fontFamily: "Orbitron, sans-serif" }}>
                Modelo
              </th>
              <th className="text-right px-5 py-3.5 font-semibold text-xs uppercase tracking-wider"
                style={{ color: "hsl(215 15% 55%)", fontFamily: "Orbitron, sans-serif" }}>
                Precio
              </th>
              <th className="text-right px-5 py-3.5 font-semibold text-xs uppercase tracking-wider"
                style={{ color: "hsl(215 15% 55%)", fontFamily: "Orbitron, sans-serif" }}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {modelos.map((m, i) => (
              <tr
                key={m.id}
                className="border-t transition-colors"
                style={{
                  background: i % 2 === 0 ? "hsl(220 18% 10%)" : "hsl(220 15% 11%)",
                  borderColor: "hsl(220 15% 16%)",
                }}
              >
                <td className="px-5 py-3.5" style={{ color: "hsl(210 20% 88%)" }}>{m.modelo}</td>
                <td className="px-5 py-3.5 text-right font-bold" style={{ color: "hsl(175 80% 55%)" }}>
                  {m.precio || "Consultar"}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEdit(m)}
                      className="p-1.5 rounded-lg transition-all"
                      style={{ color: "hsl(215 15% 60%)" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "hsl(220 15% 18%)";
                        (e.currentTarget as HTMLElement).style.color = "hsl(175 80% 55%)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                        (e.currentTarget as HTMLElement).style.color = "hsl(215 15% 60%)";
                      }}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="p-1.5 rounded-lg transition-all"
                      style={{ color: "hsl(0 84% 65%)" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "hsl(0 84% 60% / 0.12)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal
          title={modal.mode === "add" ? "Agregar Destraba" : "Editar Destraba"}
          onClose={() => setModal(null)}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "hsl(215 15% 55%)" }}>
                Modelo
              </label>
              <input
                className="input-field"
                placeholder="Ej: PlayStation 4 (todas las versiones)"
                value={form.modelo}
                onChange={(e) => setForm({ ...form, modelo: e.target.value })}
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "hsl(215 15% 55%)" }}>
                Precio
              </label>
              <input
                className="input-field"
                placeholder="Ej: $2.500"
                value={form.precio}
                onChange={(e) => setForm({ ...form, precio: e.target.value })}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="btn-ghost flex-1 text-sm">Cancelar</button>
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
