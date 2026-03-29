import { useState } from "react";
import { Server, Plus, Trash2, Pencil } from "lucide-react";
import { usePlataformas, genId, type Plataforma, useJuegos } from "../../store";
import { useAuth } from "../../hooks/useAuth";
import Modal from "../Modal";
import PageHeader from "../PageHeader";

export default function Plataformas() {
  const [plataformas, setPlataformas] = usePlataformas();
  const { user } = useAuth();
  const [juegos, setJuegos] = useJuegos();
  const [modal, setModal] = useState<{ mode: "add" | "edit"; item?: Plataforma } | null>(null);
  const [form, setForm] = useState<Omit<Plataforma, "id">>({ name: "" });

  const openAdd = () => {
    setForm({ name: "" });
    setModal({ mode: "add" });
  };

  const openEdit = (item: Plataforma) => {
    setForm({ name: item.name });
    setModal({ mode: "edit", item });
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    
    if (modal?.mode === "add") {
      setPlataformas((prev) => [...prev, { id: genId(), ...form }]);
    } else if (modal?.item) {
      setPlataformas((prev) =>
        prev.map((p) => (p.id === modal.item!.id ? { ...p, ...form } : p))
      );
    }
    
    setForm({ name: "" });
    setModal(null);
  };

  const handleDelete = (id: string) => {
    const affectedGames = juegos.filter(j => j.plataformas?.includes(id));
    
    let message = "¿Eliminar esta plataforma?";
    if (affectedGames.length > 0) {
      message = `Esta plataforma está asignada a ${affectedGames.length} juegos. Si la eliminas, se quitará de esos juegos automáticamente. ¿Continuar?`;
    }

    if (confirm(message)) {
      setPlataformas((prev) => prev.filter((p) => p.id !== id));
      setJuegos((prev) => prev.map(j => ({
        ...j,
        plataformas: j.plataformas?.filter(pId => pId !== id) || []
      })));
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        icon={Server}
        title="Gestión de Plataformas"
        description={`${plataformas.length} plataformas configuradas`}
        action={
          <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={16} /> Agregar Plataforma
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plataformas.map((p, i) => (
          <div
            key={p.id}
            className="flex items-center justify-between px-5 py-4 rounded-xl border transition-all duration-200 group"
            style={{ background: "hsl(220 18% 10%)", borderColor: "hsl(220 15% 18%)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "hsl(175 80% 50% / 0.25)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "hsl(220 15% 18%)")}
          >
            <div className="flex items-center gap-4">
              <span
                className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{ background: "hsl(175 80% 50% / 0.12)", color: "hsl(175 80% 60%)" }}
              >
                {i + 1}
              </span>
              <span className="font-medium text-sm" style={{ color: "hsl(210 20% 88%)" }}>
                {p.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => openEdit(p)}
                className="p-2 rounded-lg transition-all"
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
                onClick={() => handleDelete(p.id)}
                className="p-2 rounded-lg transition-all"
                style={{ color: "hsl(0 84% 65%)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "hsl(0 84% 60% / 0.12)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-8 px-4 py-4 rounded-xl text-sm leading-relaxed"
        style={{ background: "hsl(175 80% 50% / 0.05)", border: "1px solid hsl(175 80% 50% / 0.1)", color: "hsl(175 80% 70%)" }}
      >
        <p className="font-semibold mb-1 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
          Nota sobre escalabilidad
        </p>
        Las plataformas definidas aquí aparecerán como opciones al agregar o editar juegos. 
        Este sistema permite agregar nuevas tecnologías (como PS6) o quitar aquellas que ya no se comercialicen sin afectar la integridad del catálogo.
      </div>

      {modal && (
        <Modal title={modal.mode === "add" ? "Nueva Plataforma" : "Editar Plataforma"} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "hsl(215 15% 55%)" }}>
                Nombre de la plataforma
              </label>
              <input
                className="input-field"
                placeholder="Ej: PlayStation 6, Steam, etc."
                value={form.name}
                onChange={(e) => setForm({ name: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                autoFocus
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="btn-ghost flex-1 text-sm">Cancelar</button>
              <button onClick={handleSave} className="btn-primary flex-1 text-sm">
                {modal.mode === "add" ? "Guardar" : "Actualizar"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
