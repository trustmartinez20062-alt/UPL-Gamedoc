import { useState } from "react";
import { Gamepad2, Plus, Pencil, Trash2 } from "lucide-react";
import { useJuegos, genId, type Juego } from "../../store";
import Modal from "../Modal";
import PageHeader from "../PageHeader";

const EMOJIS = ["⚽", "🚗", "🔫", "🕷️", "🧙", "⛏️", "🎯", "🏀", "🎮", "🏆", "💥", "🔥", "🌟", "🎲", "⚡", "🦇"];
const PLATAFORMAS = ["PS4 / PS5", "PS5", "PS4", "Xbox", "PS4 / PS5 / Xbox", "Nintendo Switch", "Todas las plataformas", "PC", "Xbox / PC"];

export default function Juegos() {
  const [juegos, setJuegos] = useJuegos();
  const [modal, setModal] = useState<{ mode: "add" | "edit"; item?: Juego } | null>(null);
  const [form, setForm] = useState<Omit<Juego, "id">>({ name: "", plataforma: "PS4 / PS5", emoji: "🎮", precio: "Consultar" });
  const [search, setSearch] = useState("");

  const filtered = juegos.filter((j) =>
    j.name.toLowerCase().includes(search.toLowerCase()) ||
    j.plataforma.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setForm({ name: "", plataforma: "PS4 / PS5", emoji: "🎮", precio: "Consultar" });
    setModal({ mode: "add" });
  };

  const openEdit = (item: Juego) => {
    setForm({ name: item.name, plataforma: item.plataforma, emoji: item.emoji, precio: item.precio });
    setModal({ mode: "edit", item });
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (modal?.mode === "add") {
      setJuegos((prev) => [...prev, { id: genId(), ...form }]);
    } else if (modal?.item) {
      setJuegos((prev) =>
        prev.map((j) => (j.id === modal.item!.id ? { ...j, ...form } : j))
      );
    }
    setModal(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Eliminar este juego?")) {
      setJuegos((prev) => prev.filter((j) => j.id !== id));
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        icon={Gamepad2}
        title="Catálogo de Juegos"
        description={`${juegos.length} juegos en catálogo`}
        action={
          <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={16} /> Agregar Juego
          </button>
        }
      />

      {/* Search */}
      <div className="mb-5">
        <input
          className="input-field max-w-sm"
          placeholder="Buscar juego o plataforma..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((j) => (
          <div
            key={j.id}
            className="rounded-xl border p-4 transition-all duration-200 group"
            style={{ background: "hsl(220 18% 10%)", borderColor: "hsl(220 15% 18%)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "hsl(175 80% 50% / 0.3)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "hsl(220 15% 18%)")}
          >
            <div className="text-center mb-3">
              <span className="text-3xl block mb-2">{j.emoji}</span>
              <h3 className="font-semibold text-sm" style={{ color: "hsl(210 20% 92%)" }}>{j.name}</h3>
              <p className="text-xs mt-1" style={{ color: "hsl(215 15% 50%)" }}>{j.plataforma}</p>
              <p className="text-sm font-bold mt-1" style={{ color: "hsl(175 80% 55%)" }}>{j.precio}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => openEdit(j)}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{ background: "hsl(220 15% 16%)", color: "hsl(215 15% 70%)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "hsl(220 15% 20%)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "hsl(220 15% 16%)")}
              >
                <Pencil size={12} /> Editar
              </button>
              <button
                onClick={() => handleDelete(j.id)}
                className="p-1.5 rounded-lg transition-all"
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

      {filtered.length === 0 && (
        <div className="text-center py-16" style={{ color: "hsl(215 15% 45%)" }}>
          <Gamepad2 size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No se encontraron juegos</p>
        </div>
      )}

      {modal && (
        <Modal
          title={modal.mode === "add" ? "Agregar Juego" : "Editar Juego"}
          onClose={() => setModal(null)}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "hsl(215 15% 55%)" }}>
                Nombre del juego
              </label>
              <input
                className="input-field"
                placeholder="Ej: EA FC 25"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "hsl(215 15% 55%)" }}>
                Plataforma
              </label>
              <select
                className="input-field"
                value={form.plataforma}
                onChange={(e) => setForm({ ...form, plataforma: e.target.value })}
              >
                {PLATAFORMAS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "hsl(215 15% 55%)" }}>
                Precio
              </label>
              <input
                className="input-field"
                placeholder="Ej: $500 o Consultar"
                value={form.precio}
                onChange={(e) => setForm({ ...form, precio: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "hsl(215 15% 55%)" }}>
                Emoji
              </label>
              <div className="flex flex-wrap gap-2">
                {EMOJIS.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setForm({ ...form, emoji: e })}
                    className="w-9 h-9 text-lg rounded-lg transition-all flex items-center justify-center"
                    style={{
                      background: form.emoji === e ? "hsl(175 80% 50% / 0.2)" : "hsl(220 15% 16%)",
                      border: form.emoji === e ? "1px solid hsl(175 80% 50% / 0.5)" : "1px solid hsl(220 15% 22%)",
                    }}
                  >
                    {e}
                  </button>
                ))}
              </div>
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
