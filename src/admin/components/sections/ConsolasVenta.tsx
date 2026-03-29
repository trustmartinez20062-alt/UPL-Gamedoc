import { useState, useRef } from "react";
import { Monitor, Plus, Pencil, Trash2, Upload, Loader2 } from "lucide-react";
import { useConsolasVenta, genId, type ConsolaVenta } from "../../store";
import { uploadImage, deleteImageFromStorage } from "../../../lib/db";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "@/components/ui/sonner";
import Modal from "../Modal";
import PageHeader from "../PageHeader";

export default function ConsolasVenta() {
  // @DB-CRUD-STATE: Sincronizar con tabla 'products' (categoría consolas_venta).
  const [consolas, setConsolas] = useConsolasVenta();
  const { user } = useAuth();
  const [modal, setModal] = useState<{ mode: "add" | "edit"; item?: ConsolaVenta } | null>(null);
  const [form, setForm] = useState<Omit<ConsolaVenta, "id">>({ name: "", estado: "Nueva", precio: "", image: "" });
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openAdd = () => {
    setForm({ name: "", estado: "Nueva", precio: "", image: "" });
    setLocalPreview(null);
    setModal({ mode: "add" });
  };

  const openEdit = (item: ConsolaVenta) => {
    setForm({ name: item.name, estado: item.estado, precio: item.precio || "", image: item.image });
    setLocalPreview(null);
    setModal({ mode: "edit", item });
  };

  // @DB-CRUD-LOGIC: Migrar a supabase.from('products').upsert().
  const handleSave = async () => {
    if (!form.name.trim()) return;
    if (modal?.mode === "add") {
      setConsolas((prev) => [...prev, { id: genId(), ...form } as ConsolaVenta]);
    } else if (modal?.item) {
      // Si la imagen cambió y teníamos una subida, borrar la anterior
      if (modal.item.image && modal.item.image !== form.image) {
        await deleteImageFromStorage(modal.item.image);
        toast.info("Imagen anterior eliminada del servidor");
      }
      setConsolas((prev) =>
        prev.map((c) => (c.id === modal.item!.id ? ({ ...c, ...form } as ConsolaVenta) : c))
      );
    }
    setModal(null);
  };

  const handleDelete = async (id: string) => {
    const itemToDelete = consolas.find(c => c.id === id);
    if (itemToDelete && confirm("¿Eliminar esta consola?")) {
      if (itemToDelete.image) {
        await deleteImageFromStorage(itemToDelete.image);
        toast.info("Imagen eliminada del servidor");
      }
      setConsolas((prev) => prev.filter((c) => c.id !== id));
      toast.success("Consola eliminada correctamente");
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validación de imagen legible
    const isValidImage = await new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = URL.createObjectURL(file);
    });

    if (!isValidImage) {
      toast.error("El archivo no es una imagen válida o está corrupto");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setUploading(true);
    setLocalPreview(URL.createObjectURL(file));
    try {
      const url = await uploadImage(file, "consolas");
      if (url) {
        setForm(prev => ({ ...prev, image: url }));
        toast.success("Imagen subida con éxito");
      }
    } catch (err) {
      toast.error("Error al subir la imagen");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
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
            {/* Estado Badge */}
            <span className={
              c.estado === "Nueva" ? "badge-new" : 
              c.estado === "Usada" ? "badge-used" : 
              "badge-refurbished"
            }>
              {c.estado}
            </span>

            <div className="mt-3 text-center">
              <div className="aspect-video w-full overflow-hidden rounded-md mb-3">
                <img src={c.image} alt={c.name} className="h-full w-full object-cover" />
              </div>
              <h3 className="font-semibold text-sm" style={{ color: "hsl(210 20% 92%)" }}>
                {c.name}
              </h3>
              <p className="mt-1 text-xs font-bold text-primary">
                {c.precio || "Consultar"}
              </p>
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
                value={form.estado}
                onChange={(e) => setForm({ ...form, estado: e.target.value as any })}
              >
                <option value="Nueva">Nueva</option>
                <option value="Usada">Usada</option>
                <option value="Restaurada">Restaurada</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "hsl(215 15% 55%)" }}>
                Precio
              </label>
              <input
                className="input-field"
                placeholder="Ej: $25.900 o dejar vacío para 'Consultar'"
                value={form.precio}
                onChange={(e) => setForm({ ...form, precio: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "hsl(215 15% 55%)" }}>
                Imagen de la Consola (URL o Archivo)
              </label>
              
              <div className="flex gap-2 mb-3">
                <input
                  className="input-field flex-1"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={form.image}
                  onChange={(e) => {
                    setForm({ ...form, image: e.target.value });
                    setLocalPreview(null);
                  }}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={onFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 px-4 rounded-lg border border-dashed transition-all hover:bg-muted/10"
                  style={{ 
                    borderColor: "hsl(220 15% 25%)", 
                    color: "hsl(215 15% 60%)" 
                  }}
                >
                  {uploading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <Upload size={16} />
                      <span className="text-xs font-medium">Subir</span>
                    </>
                  )}
                </button>
              </div>

              {(form.image || localPreview) && (
                <div className="relative group/preview mt-2 aspect-video w-full max-w-[200px] overflow-hidden rounded-md border" style={{ borderColor: 'hsl(220 15% 22%)' }}>
                  <img src={localPreview || form.image} alt="Preview" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity">
                    <p className="text-[10px] text-white font-bold px-1 text-center">Preview</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="btn-ghost flex-1 text-sm">
                Cancelar
              </button>
              <button 
                onClick={handleSave} 
                disabled={uploading}
                className="btn-primary flex-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? "Subiendo..." : (modal.mode === "add" ? "Agregar" : "Guardar")}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
