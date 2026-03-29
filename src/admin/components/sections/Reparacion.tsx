import { useState } from "react";
import { Wrench, Plus, Trash2 } from "lucide-react";
import { useReparacion, genId, type ReparacionModelo } from "../../store";
import Modal from "../Modal";
import PageHeader from "../PageHeader";

export default function Reparacion() {
  const [modelos, setModelos] = useReparacion();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<Omit<ReparacionModelo, "id">>({ modelo: "" });

  const handleSave = () => {
    if (!form.modelo.trim()) return;
    setModelos((prev) => [...prev, { id: genId(), ...form }]);
    setForm({ modelo: "" });
    setModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Eliminar este modelo?")) {
      setModelos((prev) => prev.filter((m) => m.id !== id));
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        icon={Wrench}
        title="Reparación de Consolas"
        description={`${modelos.length} modelos disponibles para reparación`}
        action={
          <button onClick={() => setModal(true)} className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={16} /> Agregar Modelo
          </button>
        }
      />

      <div className="space-y-3">
        {modelos.map((m, i) => (
          <div
            key={m.id}
            className="flex items-center justify-between px-5 py-4 rounded-xl border transition-all duration-200 group"
            style={{ background: "hsl(220 18% 10%)", borderColor: "hsl(220 15% 18%)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "hsl(175 80% 50% / 0.25)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "hsl(220 15% 18%)")}
          >
            <div className="flex items-center gap-4">
              <span
                className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{ background: "hsl(175 80% 50% / 0.12)", color: "hsl(175 80% 60%)" }}
              >
                {i + 1}
              </span>
              <span className="font-medium text-sm" style={{ color: "hsl(210 20% 88%)" }}>
                {m.modelo}
              </span>
            </div>
            <button
              onClick={() => handleDelete(m.id)}
              className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
              style={{ color: "hsl(0 84% 65%)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "hsl(0 84% 60% / 0.12)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      <div
        className="mt-4 px-4 py-3 rounded-lg text-sm"
        style={{ background: "hsl(175 80% 50% / 0.06)", border: "1px solid hsl(175 80% 50% / 0.15)", color: "hsl(175 80% 65%)" }}
      >
        💡 Consultanos por WhatsApp para diagnóstico y presupuesto sin cargo.
      </div>

      {modal && (
        <Modal title="Agregar Modelo de Reparación" onClose={() => setModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "hsl(215 15% 55%)" }}>
                Modelo / familia de consola
              </label>
              <input
                className="input-field"
                placeholder="Ej: PlayStation 4 / Slim / Pro"
                value={form.modelo}
                onChange={(e) => setForm({ modelo: e.target.value })}
                autoFocus
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(false)} className="btn-ghost flex-1 text-sm">Cancelar</button>
              <button onClick={handleSave} className="btn-primary flex-1 text-sm">Agregar</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
