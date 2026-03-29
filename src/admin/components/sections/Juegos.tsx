import { useState } from "react";
import { Gamepad2, Plus, Pencil, Trash2, Check } from "lucide-react";
import { useJuegos, usePlataformas, genId, type Juego } from "../../store";
import Modal from "../Modal";
import PageHeader from "../PageHeader";

export default function Juegos() {
  const [juegos, setJuegos] = useJuegos();
  const [allPlataformas] = usePlataformas();
  const [modal, setModal] = useState<{ mode: "add" | "edit"; item?: Juego } | null>(null);
  const [form, setForm] = useState<Omit<Juego, "id">>({ 
    name: "", 
    plataformas: [], 
    image: "", 
    precio: "Consultar" 
  });
  const [search, setSearch] = useState("");

  const getPlatformNames = (ids: string[]) => {
    return ids
      .map(id => allPlataformas.find(p => p.id === id)?.name)
      .filter(Boolean)
      .join(" / ");
  };

  const filtered = juegos.filter((j) => {
    const names = getPlatformNames(j.plataformas || []);
    return j.name.toLowerCase().includes(search.toLowerCase()) ||
           names.toLowerCase().includes(search.toLowerCase());
  });

  const openAdd = () => {
    setForm({ name: "", plataformas: [], image: "", precio: "Consultar" });
    setModal({ mode: "add" });
  };

  const openEdit = (item: Juego) => {
    setForm({ 
      name: item.name, 
      plataformas: item.plataformas || [], 
      image: item.image, 
      precio: item.precio 
    });
    setModal({ mode: "edit", item });
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (modal?.mode === "add") {
      setJuegos((prev) => [...prev, { id: genId(), ...form } as Juego]);
    } else if (modal?.item) {
      setJuegos((prev) =>
        prev.map((j) => (j.id === modal.item!.id ? ({ ...j, ...form } as Juego) : j))
      );
    }
    setModal(null);
  };

  const togglePlataforma = (id: string) => {
    setForm(prev => ({
      ...prev,
      plataformas: prev.plataformas.includes(id)
        ? prev.plataformas.filter(pId => pId !== id)
        : [...prev.plataformas, id]
    }));
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
              <div className="aspect-[3/4] w-[100px] mx-auto overflow-hidden rounded-md mb-3">
                <img src={j.image} alt={j.name} className="h-full w-full object-cover" />
              </div>
              <h3 className="font-semibold text-sm line-clamp-1" style={{ color: "hsl(210 20% 92%)" }}>{j.name}</h3>
              <p className="text-xs mt-1 line-clamp-1" style={{ color: "hsl(215 15% 50%)" }}>
                {getPlatformNames(j.plataformas || []) || "Sin plataforma"}
              </p>
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
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: "hsl(215 15% 55%)" }}>
                Plataformas Disponibles
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {allPlataformas.map((p) => {
                  const isSelected = form.plataformas.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => togglePlataforma(p.id)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border text-left transition-all"
                      style={{ 
                        background: isSelected ? "hsl(175 80% 50% / 0.1)" : "hsl(220 15% 12%)",
                        borderColor: isSelected ? "hsl(175 80% 50% / 0.4)" : "hsl(220 15% 20%)"
                      }}
                    >
                      <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                        isSelected ? "bg-primary border-primary" : "border-muted-foreground/30"
                      }`} style={isSelected ? { background: "hsl(175 80% 50%)", borderColor: "hsl(175 80% 50%)" } : {}}>
                        {isSelected && <Check size={10} className="text-black" />}
                      </div>
                      <span className="text-xs font-medium" style={{ color: isSelected ? "hsl(175 80% 70%)" : "hsl(215 15% 60%)" }}>
                        {p.name}
                      </span>
                    </button>
                  );
                })}
              </div>
              {allPlataformas.length === 0 && (
                <p className="text-xs italic" style={{ color: "hsl(215 15% 45%)" }}>
                  No hay plataformas configuradas. Andá a la sección "Plataformas" primero.
                </p>
              )}
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
                URL de Imagen
              </label>
              <input
                className="input-field"
                placeholder="https://ejemplo.com/caratula.jpg"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
              {form.image && (
                <div className="mt-2 aspect-[3/4] w-[80px] overflow-hidden rounded-md border" style={{ borderColor: 'hsl(220 15% 22%)' }}>
                  <img src={form.image} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
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
