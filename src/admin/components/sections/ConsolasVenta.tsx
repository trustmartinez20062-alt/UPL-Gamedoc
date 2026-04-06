import { useState, useRef, useMemo } from "react";
import { Monitor, Plus, Pencil, Trash2, Upload, Loader2, Search, X, GripVertical } from "lucide-react";
import { ReactSortable } from "react-sortablejs";
import { useConsolasVenta, genId, type ConsolaVenta } from "../../store";
import { uploadImage, deleteImageFromStorage, updateConsolasVentaOrder } from "../../../lib/db";
import { useAuth } from "../../hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/sonner";
import { formatPriceForDB, parsePriceForForm } from "../../../lib/utils";
import Modal from "../Modal";
import PageHeader from "../PageHeader";

export default function ConsolasVenta() {
  // @DB-CRUD-STATE: Sincronizar con tabla 'products' (categoría consolas_venta).
  const [consolas, setConsolas] = useConsolasVenta();
  const queryCache = useQueryClient();
  const { user } = useAuth();
  const [modal, setModal] = useState<{ mode: "add" | "edit"; item?: ConsolaVenta } | null>(null);
  const [form, setForm] = useState<Omit<ConsolaVenta, "id">>({ name: "", estado: "Nueva", version: "Original", info: "", garantia: "", precio: "", moneda: "UYU", image: "", mercadolibre_url: "" });
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    return consolas.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) || 
      c.estado?.toLowerCase().includes(search.toLowerCase()) ||
      c.info?.toLowerCase().includes(search.toLowerCase())
    );
  }, [consolas, search]);

  const openAdd = () => {
    setForm({ name: "", estado: "Nueva", version: "Original", info: "", garantia: "", precio: "", moneda: "UYU", image: "", mercadolibre_url: "" });
    setLocalPreview(null);
    setModal({ mode: "add" });
  };

  const openEdit = (item: ConsolaVenta) => {
    setForm({ 
      name: item.name, 
      estado: item.estado, 
      version: item.version || "Original", 
      info: item.info || "", 
      garantia: item.garantia || "", 
      precio: parsePriceForForm(item.precio), 
      moneda: item.moneda || "UYU",
      image: item.image,
      mercadolibre_url: item.mercadolibre_url || ""
    });
    setLocalPreview(null);
    setModal({ mode: "edit", item });
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const dataToSave = { ...form, precio: formatPriceForDB(form.precio, form.moneda) };

      if (modal?.mode === "add") {
        await setConsolas((prev) => [...prev, { id: genId(), ...dataToSave } as ConsolaVenta]);
        toast.success("Consola agregada con éxito");
      } else if (modal?.item) {
        if (modal.item.image && modal.item.image !== form.image) {
          await deleteImageFromStorage(modal.item.image);
        }
        await setConsolas((prev) =>
          prev.map((c) => (c.id === modal.item!.id ? ({ ...c, ...dataToSave } as ConsolaVenta) : c))
        );
        toast.success("Consola actualizada con éxito");
      }
      setModal(null);
    } catch (error) {
      toast.error("Error al guardar los cambios");
    } finally {
      setSaving(false);
    }
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

      {/* Search Bar */}
      <div className="mb-6 relative max-w-md">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 pointer-events-none">
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Buscar consola por nombre, estado o info..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field !pl-11 pr-10"
        />
        {search && (
          <button 
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground/30 hover:bg-muted/10 hover:text-foreground transition-all"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="mb-8">
        {search ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((c) => (
              <div
                key={c.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5"
              >
                <div className="aspect-[16/13] overflow-hidden relative">
                  <img src={c.image} alt={c.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-black/20 to-transparent" />
                  
                  <div className={`absolute top-3 left-3 z-10 px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-xl ${
                    c.estado === "Nueva" ? "bg-cyan-500/20 text-cyan-400" : 
                    c.estado === "Usada" ? "bg-yellow-500/20 text-yellow-500" : 
                    "bg-purple-500/20 text-purple-400"
                  }`}>
                    {c.estado}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    {c.version || "Consola"} {c.garantia && `• ${c.garantia}`}
                  </div>
                  
                  <h3 className="mb-3 font-heading text-base font-black text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {c.name}
                  </h3>
                  
                  <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                    <span className="font-black text-primary text-glow text-lg">
                      {c.precio || "Consultar"}
                    </span>
                    
                    <div className="flex gap-1 ml-2">
                      <button
                        onClick={() => openEdit(c)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:bg-primary/20 hover:text-primary transition-all"
                        title="Editar"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 rounded-lg text-destructive/70 hover:bg-destructive/10 hover:text-destructive transition-all"
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ReactSortable
            list={consolas as any[]}
            setList={async (newList) => {
              const updated = newList.map((item, index) => ({ ...item, orden: index }));
              const hasChanges = consolas.some((c, index) => c.id !== updated[index].id);
              if (!hasChanges) return;

              // Actualización optimista instantánea
              queryCache.setQueryData(["consolas_venta"], updated);

              // Sincronización en bulk con Supabase (rápido y 1 sola llamada)
              const updates = updated.map((c) => ({ id: c.id, orden: c.orden }));
              await updateConsolasVentaOrder(updates);
            }}
            animation={200}
            delay={2}
            handle=".drag-handle"
            ghostClass="opacity-30"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {consolas.map((c) => (
              <div
                key={c.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 origin-center"
              >
                <div className="drag-handle absolute top-2 right-2 z-20 p-2 rounded-lg bg-black/60 text-white/70 opacity-0 group-hover:opacity-100 transition-all cursor-grab active:cursor-grabbing backdrop-blur-md shadow-lg border border-white/5 hover:bg-black/80 hover:text-white">
                  <GripVertical size={18} />
                </div>
                <div className="aspect-[16/13] overflow-hidden relative">
                  <img src={c.image} alt={c.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-black/20 to-transparent pointer-events-none" />
                  
                  <div className={`absolute top-3 left-3 z-10 px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-xl ${
                    c.estado === "Nueva" ? "bg-cyan-500/20 text-cyan-400" : 
                    c.estado === "Usada" ? "bg-yellow-500/20 text-yellow-500" : 
                    "bg-purple-500/20 text-purple-400"
                  }`}>
                    {c.estado}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    {c.version || "Consola"} {c.garantia && `• ${c.garantia}`}
                  </div>
                  
                  <h3 className="mb-3 font-heading text-base font-black text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {c.name}
                  </h3>
                  
                  <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                    <span className="font-black text-primary text-glow text-lg">
                      {c.precio || "Consultar"}
                    </span>
                    
                    <div className="flex gap-1 ml-2">
                      <button
                        onClick={() => openEdit(c)}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg text-muted-foreground hover:bg-primary/20 hover:text-primary transition-all"
                        title="Editar"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg text-destructive/70 hover:bg-destructive/10 hover:text-destructive transition-all"
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </ReactSortable>
        )}
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
                Versión
              </label>
              <select
                className="input-field"
                value={form.version}
                onChange={(e) => setForm({ ...form, version: e.target.value as any })}
              >
                <option value="Original">Original</option>
                <option value="Destrabada">Destrabada</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "hsl(215 15% 55%)" }}>
                Información extra
              </label>
              <input
                className="input-field"
                placeholder="Ej: Incluye SSD 128GB + 2 Controles"
                value={form.info}
                onChange={(e) => setForm({ ...form, info: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "hsl(215 15% 55%)" }}>
                Garantía
              </label>
              <input
                className="input-field"
                placeholder="Ej: 1 año, 6 meses (se autocompleta con 'de garantía')"
                value={form.garantia}
                onChange={(e) => setForm({ ...form, garantia: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "hsl(215 15% 55%)" }}>
                Precio y Moneda
              </label>
              <div className="flex gap-2">
                <select
                  className="input-field !w-[105px] text-xs text-center !px-1 font-bold bg-black/50 border-primary/30 text-primary cursor-pointer hover:bg-primary/10 hover:border-primary/50 transition-all shadow-[0_0_10px_rgba(0,255,170,0.05)] appearance-none"
                  value={form.moneda}
                  onChange={(e) => setForm({ ...form, moneda: e.target.value as "UYU" | "USD" })}
                >
                  <option value="UYU" className="bg-zinc-900 text-white">Pesos $</option>
                  <option value="USD" className="bg-zinc-900 text-white">Dólares US$</option>
                </select>
                <input
                  className="input-field flex-1"
                  placeholder="Ej: 25900 (solo números) o dejar vacío para 'Consultar'"
                  value={form.precio}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val !== "" && /\D/.test(val)) {
                      toast.error("Por favor, ingresa solo números. El símbolo y el punto se agregan solos.");
                    }
                    setForm({ ...form, precio: val.replace(/\D/g, "") });
                  }}
                />
              </div>
            </div>



            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "hsl(215 15% 55%)" }}>
                Enlace Mercado Libre (opcional)
              </label>
              <input
                className="input-field"
                placeholder="https://articulo.mercadolibre.com.uy/..."
                value={form.mercadolibre_url}
                onChange={(e) => setForm({ ...form, mercadolibre_url: e.target.value })}
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
              <button 
                onClick={() => setModal(null)} 
                disabled={saving}
                className="btn-ghost flex-1 text-sm disabled:opacity-50"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSave} 
                disabled={uploading || saving}
                className="btn-primary flex-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {saving ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Guardando...</span>
                  </div>
                ) : uploading ? (
                  "Subiendo..."
                ) : (
                  modal.mode === "add" ? "Agregar" : "Guardar"
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
