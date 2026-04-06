import { useState } from "react";
import { CreditCard, Plus, Pencil, Trash2, HelpCircle, Filter, ChevronDown, Loader2, GripVertical } from "lucide-react";
import { useGamePass, genId, type GamePassPlan, useGamePassTypes } from "../../store";
import { ReactSortable } from "react-sortablejs";
import { useAuth } from "../../hooks/useAuth";
import { formatPriceForDB, parsePriceForForm } from "../../../lib/utils";
import { updateGamePassOrder } from "../../../lib/db";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/sonner";
import Modal from "../Modal";
import PageHeader from "../PageHeader";

export default function GamePass() {
  const [planes, setPlanes] = useGamePass();
  const [types] = useGamePassTypes();
  const queryCache = useQueryClient();
  const { user } = useAuth();
  const [filterType, setFilterType] = useState<string>("all");
  const [modal, setModal] = useState<{ mode: "add" | "edit"; item?: GamePassPlan } | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<{ plan: string; precio: string; moneda: "UYU" | "USD"; type_id: string; mercadolibre_url: string }>({ 
    plan: "", 
    precio: "",
    moneda: "UYU",
    type_id: "",
    mercadolibre_url: ""
  });

  const openAdd = () => {
    setForm({ plan: "", precio: "", moneda: "UYU", type_id: types[0]?.id || "", mercadolibre_url: "" });
    setModal({ mode: "add" });
  };

  const openEdit = (item: GamePassPlan) => {
    setForm({ 
      plan: item.plan, 
      precio: parsePriceForForm(item.precio),
      moneda: item.moneda || "UYU",
      type_id: item.type_id || "",
      mercadolibre_url: item.mercadolibre_url || ""
    });
    setModal({ mode: "edit", item });
  };

  const handleSave = async () => {
    if (!form.plan.trim() || !form.type_id) return;
    setSaving(true);
    try {
      const data = { 
        plan: form.plan, 
        precio: formatPriceForDB(form.precio, form.moneda),
        moneda: form.moneda,
        type_id: form.type_id || null,
        mercadolibre_url: form.mercadolibre_url || null
      };

      if (modal?.mode === "add") {
        await setPlanes((prev) => [...prev, { id: genId(), ...data } as any]);
        toast.success("Plan agregado con éxito");
      } else if (modal?.item) {
        await setPlanes((prev) =>
          prev.map((p) => (p.id === modal.item!.id ? { ...p, ...data } : p))
        );
        toast.success("Plan actualizado con éxito");
      }
      setModal(null);
    } catch (error) {
      toast.error("Error al guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Eliminar este plan?")) {
      setPlanes((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const filteredPlanes = filterType === "all" 
    ? planes 
    : planes.filter(p => p.type_id === filterType);

  return (
    <div className="animate-fade-in">
      <PageHeader
        icon={CreditCard}
        title="Catálogo Game Pass"
        description={`${planes.length} planes configurados`}
        action={
          <div className="flex items-center gap-3">
            {/* Filter Select */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="h-10 pl-9 pr-10 rounded-lg border border-border bg-card text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer hover:border-primary/50 transition-colors"
                style={{ minWidth: "160px" }}
              >
                <option value="all">Todos los tipos</option>
                {types.map(t => (
                  <option key={t.id} value={t.id}>{t.prefix} {t.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>

            <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
              <Plus size={16} /> Agregar Plan
            </button>
          </div>
        }
      />

      {/* Single Grid for all planes */}
      <div className="space-y-6">
        {filteredPlanes.length > 0 ? (
          filterType !== "all" ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredPlanes.map((p) => {
                const type = types.find(t => t.id === p.type_id);
                return (
                  <div
                    key={p.id}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5"
                  >
                    <div className="aspect-[16/13] overflow-hidden relative">
                      {type?.image ? (
                        <img src={type.image} alt={type.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      ) : (
                        <div className="h-full w-full bg-muted/20 flex items-center justify-center">
                          <span className="text-muted-foreground/10 font-black text-6xl italic tracking-tighter">GP</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-black/20 to-transparent" />
                      
                      {/* Badge flotante de tipo */}
                      <div className="absolute top-3 left-3 px-2 py-1 rounded bg-primary/90 text-[10px] font-black text-white uppercase tracking-wider backdrop-blur-sm shadow-xl">
                        {type?.name || "Sin tipo"}
                      </div>
                    </div>
                    
                    <div className="flex flex-1 flex-col p-4 sm:p-5">
                      <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        {type?.prefix || "Suscripción"}
                      </div>
                      <h4 className="mb-4 font-heading text-lg font-black text-foreground group-hover:text-primary transition-colors">
                        {type?.name || "Pase"} <span className="text-muted-foreground/50 font-medium lowercase">({p.plan})</span>
                      </h4>
                      
                      <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                        <span className="font-black text-primary text-glow text-xl">
                          {p.precio || "Consultar"}
                        </span>
                        
                        <div className="flex bg-background/50 rounded-xl p-1 gap-1 border border-border/50">
                          <button
                            onClick={() => openEdit(p)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:bg-primary/20 hover:text-primary transition-all"
                            title="Editar"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="p-1.5 rounded-lg text-destructive/70 hover:bg-destructive/10 hover:text-destructive transition-all"
                            title="Eliminar"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <ReactSortable 
              list={planes as any[]}
              setList={async (newList) => {
                const updated = newList.map((item, index) => ({ ...item, orden: index }));
                const hasChanges = planes.some((p, index) => p.id !== updated[index].id);
                if (!hasChanges) return;

                // Actualización optimista ultra rápida sin bloqueos
                queryCache.setQueryData(["game_pass"], updated);

                // Sincronización en bulk con Supabase
                const updates = updated.map((p) => ({ id: p.id, orden: p.orden }));
                await updateGamePassOrder(updates);
              }}
              animation={200}
              delay={2}
              handle=".drag-handle"
              ghostClass="opacity-30"
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {planes.map((p) => {
                const type = types.find(t => t.id === p.type_id);
                return (
                  <div
                    key={p.id}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 origin-center"
                  >
                    <div className="drag-handle absolute top-2 right-2 z-20 p-2 rounded-lg bg-black/60 text-white/70 opacity-0 group-hover:opacity-100 transition-all cursor-grab active:cursor-grabbing backdrop-blur-md shadow-lg border border-white/5 hover:bg-black/80 hover:text-white">
                      <GripVertical size={18} />
                    </div>
                    <div className="aspect-[16/13] overflow-hidden relative pointer-events-none">
                      {type?.image ? (
                        <img src={type.image} alt={type.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      ) : (
                        <div className="h-full w-full bg-muted/20 flex items-center justify-center">
                          <span className="text-muted-foreground/10 font-black text-6xl italic tracking-tighter">GP</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-black/20 to-transparent" />
                      
                      {/* Badge flotante de tipo */}
                      <div className="absolute top-3 left-3 px-2 py-1 rounded bg-primary/90 text-[10px] font-black text-white uppercase tracking-wider backdrop-blur-sm shadow-xl">
                        {type?.name || "Sin tipo"}
                      </div>
                    </div>
                    
                    <div className="flex flex-1 flex-col p-4 sm:p-5">
                      <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        {type?.prefix || "Suscripción"}
                      </div>
                      <h4 className="mb-4 font-heading text-lg font-black text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {type?.name || "Pase"} <span className="text-muted-foreground/50 font-medium lowercase">({p.plan})</span>
                      </h4>
                      
                      <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                        <span className="font-black text-primary text-glow text-xl">
                          {p.precio || "Consultar"}
                        </span>
                        
                        <div className="flex gap-1 ml-2">
                          <button
                            onClick={() => openEdit(p)}
                            onPointerDown={(e) => e.stopPropagation()}
                            className="p-1.5 rounded-lg text-muted-foreground hover:bg-primary/20 hover:text-primary transition-all"
                            title="Editar"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
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
                );
              })}
            </ReactSortable>
          )
        ) : (
          <div className="py-20 text-center rounded-3xl border border-dashed border-border/50 bg-card/30">
            <CreditCard size={48} className="mx-auto mb-4 opacity-10" />
            <p className="text-muted-foreground italic">No hay planes que coincidan con el filtro.</p>
          </div>
        )}
      </div>

      {modal && (
        <Modal
          title={modal.mode === "add" ? "Agregar Plan" : "Editar Plan"}
          onClose={() => setModal(null)}
        >
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2.5 text-muted-foreground">
                Seleccionar Tipo de Pase
              </label>
              {types.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {types.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setForm({ ...form, type_id: t.id })}
                      className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                        form.type_id === t.id 
                          ? "bg-primary/10 border-primary shadow-[0_0_15px_hsl(175_80%_50%_/_0.1)]" 
                          : "bg-background/40 border-muted/20 hover:border-muted/40"
                      }`}
                    >
                      <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">{t.prefix}</span>
                      <span className={`text-xs font-black uppercase ${form.type_id === t.id ? "text-primary" : "text-foreground/80"}`}>{t.name}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-muted/30 text-center">
                  <p className="text-xs text-muted-foreground mb-2">No has configurado tipos de pases todavía.</p>
                  <button 
                    onClick={() => {
                      setModal(null);
                      toast.info("Redirigiendo a Tipos de Game Pass...");
                      setTimeout(() => window.location.hash = "#/paneladmin/gamepass-types", 100);
                    }}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Ir a configurar tipos →
                  </button>
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-muted-foreground">
                  Detalle del plan
                </label>
                <input
                  className="input-field"
                  placeholder="Ej: 1 mes, 3 meses, Anual..."
                  value={form.plan}
                  onChange={(e) => setForm({ ...form, plan: e.target.value })}
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-muted-foreground">
                  Precio y Moneda
                </label>
                <div className="flex gap-2">
                  <select
                    className="input-field w-[95px] text-xs text-center px-1 font-bold bg-black/50 border-primary/30 text-primary cursor-pointer hover:bg-primary/10 hover:border-primary/50 transition-all shadow-[0_0_10px_rgba(0,255,170,0.05)] appearance-none"
                    value={form.moneda}
                    onChange={(e) => setForm({ ...form, moneda: e.target.value as "UYU" | "USD" })}
                  >
                    <option value="UYU" className="bg-zinc-900 text-white">Pesos $</option>
                    <option value="USD" className="bg-zinc-900 text-white">Dólares US$</option>
                  </select>
                  <input
                    className="input-field flex-1"
                    placeholder="Ej: 600"
                    value={form.precio}
                    onChange={(e) => setForm({ ...form, precio: e.target.value.replace(/\D/g, "") })}
                  />
                </div>
              </div>
            </div>



            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-muted-foreground">
                Enlace Mercado Libre (opcional)
              </label>
              <input
                className="input-field"
                placeholder="https://articulo.mercadolibre.com.uy/..."
                value={form.mercadolibre_url}
                onChange={(e) => setForm({ ...form, mercadolibre_url: e.target.value })}
              />
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
                disabled={!form.plan.trim() || !form.type_id || saving}
                className="btn-primary flex-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {saving ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Guardando...</span>
                  </div>
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
