import { useState } from "react";
import { DollarSign, Plus, Pencil, Trash2 } from "lucide-react";
import { useConsolasCompra, genId, type ConsolaCompra } from "../../store";
import { useAuth } from "../../hooks/useAuth";
import { formatPriceForDB, parsePriceForForm } from "../../../lib/utils";
import { toast } from "@/components/ui/sonner";
import Modal from "../Modal";
import PageHeader from "../PageHeader";

export default function ConsolasCompra() {
  // @DB-CRUD-STATE: Sincronizar con tabla de 'consolas_compra'.
  const [consolas, setConsolas] = useConsolasCompra();
  const { user } = useAuth();
  const [modal, setModal] = useState<{ mode: "add" | "edit"; item?: ConsolaCompra } | null>(null);
  const [form, setForm] = useState<Omit<ConsolaCompra, "id">>({ name: "", precio: "" });

  const openAdd = () => {
    setForm({ name: "", precio: "" });
    setModal({ mode: "add" });
  };

  const openEdit = (item: ConsolaCompra) => {
    setForm({ name: item.name, precio: parsePriceForForm(item.precio) });
    setModal({ mode: "edit", item });
  };

  // @DB-CRUD-LOGIC: Sincronizar con base de datos.
  const handleSave = () => {
    if (!form.name.trim()) return;
    const dataToSave = { ...form, precio: formatPriceForDB(form.precio) };

    if (modal?.mode === "add") {
      setConsolas((prev) => [...prev, { id: genId(), ...dataToSave } as ConsolaCompra]);
    } else if (modal?.item) {
      setConsolas((prev) =>
        prev.map((c) => (c.id === modal.item!.id ? ({ ...c, ...dataToSave } as ConsolaCompra) : c))
      );
    }
    setModal(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Eliminar este registro?")) {
      setConsolas((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        icon={DollarSign}
        title="Compra de Consolas"
        description={`${consolas.length} modelos con precio de compra`}
        action={
          <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={16} /> Agregar Modelo
          </button>
        }
      />

      <div
        className="rounded-xl border overflow-hidden"
        style={{ borderColor: "hsl(220 15% 18%)" }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "hsl(220 15% 12%)" }}>
              <th
                className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider"
                style={{ color: "hsl(215 15% 55%)", fontFamily: "Orbitron, sans-serif" }}
              >
                Modelo
              </th>
              <th
                className="text-right px-5 py-3.5 font-semibold text-xs uppercase tracking-wider"
                style={{ color: "hsl(215 15% 55%)", fontFamily: "Orbitron, sans-serif" }}
              >
                Precio aprox.
              </th>
              <th
                className="text-right px-5 py-3.5 font-semibold text-xs uppercase tracking-wider"
                style={{ color: "hsl(215 15% 55%)", fontFamily: "Orbitron, sans-serif" }}
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {consolas.map((c, i) => (
              <tr
                key={c.id}
                className="border-t transition-colors"
                style={{
                  background: i % 2 === 0 ? "hsl(220 18% 10%)" : "hsl(220 15% 11%)",
                  borderColor: "hsl(220 15% 16%)",
                }}
              >
                <td className="px-5 py-3.5" style={{ color: "hsl(210 20% 88%)" }}>
                  {c.name}
                </td>
                <td
                  className="px-5 py-3.5 text-right font-bold"
                  style={{ color: "hsl(175 80% 55%)" }}
                >
                  {c.precio || "Consultar"}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEdit(c)}
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
                      title="Editar"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-1.5 rounded-lg transition-all"
                      style={{ color: "hsl(0 84% 65%)" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "hsl(0 84% 60% / 0.12)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                      title="Eliminar"
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

      <p className="mt-3 text-xs" style={{ color: "hsl(215 15% 40%)" }}>
        * Los precios pueden variar según el estado de la consola y sus accesorios.
      </p>

      {modal && (
        <Modal
          title={modal.mode === "add" ? "Agregar Modelo" : "Editar Modelo"}
          onClose={() => setModal(null)}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "hsl(215 15% 55%)" }}>
                Nombre del modelo
              </label>
              <input
                className="input-field"
                placeholder="Ej: PlayStation 4 Slim"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "hsl(215 15% 55%)" }}>
                Precio de compra (UYU)
              </label>
              <input
                className="input-field"
                placeholder="Ej: 4000 (solo números)"
                value={form.precio}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val !== "" && /\D/.test(val)) {
                    toast.error("Por favor, ingresa solo números. El $ y el punto se agregan solos.");
                  }
                  setForm({ ...form, precio: val.replace(/\D/g, "") });
                }}
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
