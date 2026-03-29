import { useState } from "react";
import { CreditCard, Plus, Pencil, Trash2 } from "lucide-react";
import { useGamePass, genId, type GamePassPlan } from "../../store";
import { useAuth } from "../../hooks/useAuth";
import Modal from "../Modal";
import PageHeader from "../PageHeader";

export default function GamePass() {
  const [planes, setPlanes] = useGamePass();
  const { user } = useAuth();
  const [modal, setModal] = useState<{ mode: "add" | "edit"; item?: GamePassPlan } | null>(null);
  const [form, setForm] = useState<{ plan: string; precio: string; tipo: "Core" | "Ultimate" | "Otros" }>({ 
    plan: "", 
    precio: "",
    tipo: "Core"
  });

  const openAdd = () => {
    setForm({ plan: "", precio: "", tipo: "Core" });
    setModal({ mode: "add" });
  };

  const openEdit = (item: GamePassPlan) => {
    const isUltimate = item.plan.toLowerCase().includes("ultimate");
    const isCore = item.plan.toLowerCase().includes("core");
    setForm({ 
      plan: item.plan, 
      precio: item.precio,
      tipo: isUltimate ? "Ultimate" : isCore ? "Core" : "Otros"
    });
    setModal({ mode: "edit", item });
  };

  const handleSave = () => {
    if (!form.plan.trim() || !form.precio.trim()) return;
    
    // Ensure the name reflects the type if it doesn't already
    let finalName = form.plan;
    if (form.tipo === "Ultimate" && !finalName.toLowerCase().includes("ultimate")) {
      finalName = `Game Pass Ultimate ${finalName}`;
    } else if (form.tipo === "Core" && !finalName.toLowerCase().includes("core")) {
      finalName = `Game Pass Core ${finalName}`;
    }

    const data = { plan: finalName, precio: form.precio };

    if (modal?.mode === "add") {
      setPlanes((prev) => [...prev, { id: genId(), ...data }]);
    } else if (modal?.item) {
      setPlanes((prev) =>
        prev.map((p) => (p.id === modal.item!.id ? { ...p, ...data } : p))
      );
    }
    setModal(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Eliminar este plan?")) {
      setPlanes((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // Group plans by type
  const coreParams = planes.filter((p) => p.plan.toLowerCase().includes("core"));
  const ultimateParams = planes.filter((p) => p.plan.toLowerCase().includes("ultimate"));
  const otherParams = planes.filter(
    (p) => !p.plan.toLowerCase().includes("core") && !p.plan.toLowerCase().includes("ultimate")
  );

  return (
    <div className="animate-fade-in">
      <PageHeader
        icon={CreditCard}
        title="Game Pass"
        description={`${planes.length} planes disponibles`}
        action={
          <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={16} /> Agregar Plan
          </button>
        }
      />

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total planes", value: planes.length, color: "hsl(175 80% 55%)" },
          { label: "Planes Core", value: coreParams.length, color: "hsl(210 80% 60%)" },
          { label: "Planes Ultimate", value: ultimateParams.length, color: "hsl(260 70% 65%)" },
          { label: "Otros", value: otherParams.length, color: "hsl(38 92% 55%)" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border p-4"
            style={{ background: "hsl(220 18% 10%)", borderColor: "hsl(220 15% 18%)" }}
          >
            <p className="text-xs font-medium mb-1" style={{ color: "hsl(215 15% 50%)" }}>{stat.label}</p>
            <p className="text-2xl font-bold" style={{ color: stat.color, fontFamily: "Orbitron, sans-serif" }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "hsl(220 15% 18%)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "hsl(220 15% 12%)" }}>
              <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider"
                style={{ color: "hsl(215 15% 55%)", fontFamily: "Orbitron, sans-serif" }}>
                Plan
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
            {planes.map((p, i) => (
              <tr
                key={p.id}
                className="border-t transition-colors"
                style={{
                  background: i % 2 === 0 ? "hsl(220 18% 10%)" : "hsl(220 15% 11%)",
                  borderColor: "hsl(220 15% 16%)",
                }}
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background: p.plan.toLowerCase().includes("ultimate")
                          ? "hsl(260 70% 60% / 0.15)"
                          : p.plan.toLowerCase().includes("core")
                            ? "hsl(210 80% 60% / 0.15)"
                            : "hsl(38 92% 55% / 0.15)",
                        color: p.plan.toLowerCase().includes("ultimate")
                          ? "hsl(260 70% 75%)"
                          : p.plan.toLowerCase().includes("core")
                            ? "hsl(210 80% 70%)"
                            : "hsl(38 92% 70%)",
                        border: `1px solid ${p.plan.toLowerCase().includes("ultimate")
                          ? "hsl(260 70% 60% / 0.3)"
                          : p.plan.toLowerCase().includes("core")
                            ? "hsl(210 80% 60% / 0.3)"
                            : "hsl(38 92% 55% / 0.3)"}`,
                      }}
                    >
                      {p.plan.toLowerCase().includes("ultimate") ? "Ultimate" : p.plan.toLowerCase().includes("core") ? "Core" : "Otros"}
                    </span>
                    <span style={{ color: "hsl(210 20% 88%)" }}>{p.plan}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-right font-bold" style={{ color: "hsl(175 80% 55%)" }}>
                  {p.precio}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEdit(p)}
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
                      onClick={() => handleDelete(p.id)}
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
          title={modal.mode === "add" ? "Agregar Plan" : "Editar Plan"}
          onClose={() => setModal(null)}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "hsl(215 15% 55%)" }}>
                Tipo de Plan
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(["Core", "Ultimate", "Otros"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setForm({ ...form, tipo: t })}
                    className={`py-2 rounded-lg border text-xs font-bold transition-all ${
                      form.tipo === t 
                        ? "bg-primary/10 border-primary text-primary shadow-[0_0_15px_hsl(175_80%_50%_/_0.2)]" 
                        : "bg-transparent border-[hsl(220_15%_18%)] text-[hsl(215_15%_50%)] hover:border-[hsl(220_15%_25%)]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "hsl(215 15% 55%)" }}>
                Nombre / Detalle del plan
              </label>
              <input
                className="input-field"
                placeholder={form.tipo === "Otros" ? "Ej: PS Plus Extra (1 mes)" : "Ej: 1 mes, 3 meses..."}
                value={form.plan}
                onChange={(e) => setForm({ ...form, plan: e.target.value })}
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "hsl(215 15% 55%)" }}>
                Precio
              </label>
              <input
                className="input-field"
                placeholder="Ej: $600"
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
