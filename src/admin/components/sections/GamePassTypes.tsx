import { useState } from "react";
import { Server, Plus, Trash2, Pencil, Image as ImageIcon, Loader2 } from "lucide-react";
import { useGamePassTypes, genId, type GamePassType, useGamePass } from "../../store";
import { uploadImage, deleteImageFromStorage } from "../../../lib/db";
import Modal from "../Modal";
import PageHeader from "../PageHeader";

export default function GamePassTypes() {
  const [types, setTypes] = useGamePassTypes();
  const [planes] = useGamePass();
  const [modal, setModal] = useState<{ mode: "add" | "edit"; item?: GamePassType } | null>(null);
  const [form, setForm] = useState<Omit<GamePassType, "id">>({ name: "", prefix: "Game Pass", image: "" });
  const [uploading, setUploading] = useState(false);

  const openAdd = () => {
    setForm({ name: "", prefix: "Game Pass", image: "" });
    setModal({ mode: "add" });
  };

  const openEdit = (item: GamePassType) => {
    setForm({ name: item.name, prefix: item.prefix, image: item.image });
    setModal({ mode: "edit", item });
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    
    if (modal?.mode === "add") {
      setTypes((prev) => [...prev, { id: genId(), ...form }]);
    } else if (modal?.item) {
      setTypes((prev) =>
        prev.map((t) => (t.id === modal.item!.id ? { ...t, ...form } : t))
      );
    }
    
    setModal(null);
  };

  const handleDelete = async (item: GamePassType) => {
    const affectedPlanes = planes.filter(p => p.type_id === item.id);
    
    let message = "¿Eliminar este tipo de pase?";
    if (affectedPlanes.length > 0) {
      message = `Este tipo está asignado a ${affectedPlanes.length} planes. Si lo eliminas, los planes se quedarán sin tipo asociado. ¿Continuar?`;
    }

    if (confirm(message)) {
      if (item.image) {
        await deleteImageFromStorage(item.image);
      }
      setTypes((prev) => prev.filter((t) => t.id !== item.id));
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Si ya hay una imagen, borrarla antes de subir la nueva
      if (form.image) {
        await deleteImageFromStorage(form.image);
      }
      
      const url = await uploadImage(file, "game_pass_types");
      if (url) {
        setForm(prev => ({ ...prev, image: url }));
      }
    } catch (error) {
      console.error("Error al subir imagen:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        icon={Server}
        title="Tipos de Game Pass"
        description={`${types.length} tipos configurados (Core, Ultimate, etc.)`}
        action={
          <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={16} /> Agregar Tipo
          </button>
        }
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {types.map((t) => (
          <div
            key={t.id}
            className="flex flex-col rounded-2xl border overflow-hidden transition-all duration-300 group"
            style={{ background: "hsl(220 18% 10%)", borderColor: "hsl(220 15% 18%)" }}
          >
            <div className="h-44 w-full relative bg-muted/20">
              {t.image ? (
                <img src={t.image} alt={t.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                  <ImageIcon size={40} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary/80">{t.prefix}</p>
                <h4 className="font-heading font-black text-xl text-white">{t.name}</h4>
              </div>
            </div>

            <div className="p-4 flex items-center justify-end gap-2">
              <button
                onClick={() => openEdit(t)}
                className="p-2 rounded-lg bg-muted/20 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => handleDelete(t)}
                className="p-2 rounded-lg bg-muted/20 text-destructive/70 hover:bg-destructive/10 hover:text-destructive transition-all"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={modal.mode === "add" ? "Nuevo Tipo de Pase" : "Editar Tipo"} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-muted-foreground">
                  Prefijo (Ej: Xbox)
                </label>
                <input
                  className="input-field"
                  placeholder="Ej: Game Pass"
                  value={form.prefix}
                  onChange={(e) => setForm({ ...form, prefix: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-muted-foreground">
                  Nombre (Ej: Core o Ultimate)
                </label>
                <input
                  className="input-field"
                  placeholder="Ej: Ultimate"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-muted-foreground">
                Imagen del pase
              </label>
              <div className="flex items-center gap-4">
                <div 
                  className="w-24 h-24 rounded-xl border-2 border-dashed border-muted/30 flex items-center justify-center overflow-hidden relative group cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => document.getElementById("pass-image-upload")?.click()}
                >
                  {uploading ? (
                    <Loader2 className="animate-spin text-primary" />
                  ) : form.image ? (
                    <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Plus className="text-muted-foreground/30" />
                  )}
                  <input 
                    id="pass-image-upload" 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                  />
                </div>
                <div className="text-xs text-muted-foreground flex-1">
                  <p className="font-semibold mb-1">Imagen de fondo</p>
                  <p>Resolución recomendada: 600x400px. Esta imagen se usará en las tarjetas de la tienda.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button onClick={() => setModal(null)} className="btn-ghost flex-1 text-sm">Cancelar</button>
              <button 
                onClick={handleSave} 
                disabled={uploading || !form.name.trim()}
                className="btn-primary flex-1 text-sm"
              >
                {modal.mode === "add" ? "Guardar" : "Actualizar"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
