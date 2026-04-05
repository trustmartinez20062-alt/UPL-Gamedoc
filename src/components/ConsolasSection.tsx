import { motion } from "framer-motion";
import { ShoppingCart, DollarSign, Wrench, Unlock } from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";
import { 
  useConsolasVenta, 
  useConsolasCompra, 
  useReparacion, 
  useDestraba 
} from "../admin/store";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

// Helper for skeleton loading
const LoadingSkeleton = ({ count = 3, type = "card" }: { count?: number, type?: "card" | "row" | "pill" }) => {
  if (type === "row") {
    return (
      <div className="space-y-4 p-4">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="flex justify-between items-center py-3 border-b border-border/50">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    );
  }
  
  if (type === "pill") {
    return (
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-3">
        {[...Array(count)].map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:gap-6 grid-cols-2 lg:grid-cols-3">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-3 sm:p-6 space-y-4">
          <Skeleton className="aspect-video w-full rounded-md" />
          <Skeleton className="h-4 w-2/3 mx-auto" />
          <Skeleton className="h-4 w-1/3 mx-auto" />
        </div>
      ))}
    </div>
  );
};

const sectionVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ConsolasSection = () => {
  const [consolasVenta, , queryVenta] = useConsolasVenta();
  const [consolasCompra, , queryCompra] = useConsolasCompra();
  const [reparacionModelos, , queryReparacion] = useReparacion();
  const [destrabaModelos, , queryDestraba] = useDestraba();

  const isLoading = queryVenta.isLoading || queryCompra.isLoading || queryReparacion.isLoading || queryDestraba.isLoading;

  return (
    <section id="consolas" className="py-24">
      <div className="container space-y-20">
        {/* ──────────── Título principal ──────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariant}
          className="text-center"
        >
          <h2 className="mb-4 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            <span className="text-primary text-glow">Consolas</span>
          </h2>
          <p className="mx-auto max-w-lg text-muted-foreground">
            Venta, compra, reparación y destraba. Todo lo que necesitás para tu
            consola, en un solo lugar.
          </p>
        </motion.div>

        {/* ──────────── 1. Venta de consolas ──────────── */}
        <motion.div
          id="venta"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariant}
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="inline-flex rounded-lg bg-primary/10 p-2 text-primary">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-foreground">
              Venta de Consolas
            </h3>
          </div>

          {isLoading ? (
            <LoadingSkeleton count={6} />
          ) : consolasVenta.length > 0 ? (
            <div className="grid gap-3 sm:gap-6 grid-cols-2 lg:grid-cols-3">
              {consolasVenta.map((c, i) => (
                <motion.div
                  key={c.id || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="group relative overflow-hidden rounded-xl border border-border bg-card p-3 sm:p-6 text-center transition-all hover:border-primary/40"
                >
                  {c.estado && (
                    <div className="absolute right-2 top-2 z-10 rounded-full bg-primary/20 px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-primary">
                      {c.estado}
                    </div>
                  )}
                  <div className="mb-3 sm:mb-4 aspect-video overflow-hidden rounded-md bg-muted">
                    {c.image ? (
                      <img 
                        src={c.image} 
                        alt={c.name} 
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" 
                        loading="lazy" 
                        decoding="async" 
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        Sin imagen
                      </div>
                    )}
                  </div>
                  <h3 className="font-heading text-sm sm:text-lg font-semibold text-foreground line-clamp-1">
                    {c.name}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm font-bold text-primary">
                    {(!c.precio || c.precio.toLowerCase().includes("consultar")) ? "Consultar precio" : c.precio}
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
              No hay consolas en venta actualmente.
            </div>
          )}
        </motion.div>

        {/* ──────────── 2. Compra de consolas ──────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariant}
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="inline-flex rounded-lg bg-primary/10 p-2 text-primary">
              <DollarSign className="h-5 w-5" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-foreground">
              Compra de Consolas
            </h3>
          </div>
          <p className="mb-6 max-w-xl text-muted-foreground">
            ¿Querés vender tu consola? En <strong className="text-foreground">Game Doctor</strong> compramos
            consolas usadas. Estos son nuestros precios de referencia:
          </p>

          <div className="overflow-hidden rounded-xl border border-border bg-card">
            {isLoading ? (
              <LoadingSkeleton count={5} type="row" />
            ) : consolasCompra.length > 0 ? (
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/40 font-heading">
                  <tr>
                    <th className="px-5 py-3 font-semibold text-foreground border-b border-border">Modelo</th>
                    <th className="px-5 py-3 text-right font-semibold text-foreground border-b border-border">Precio aprox.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {consolasCompra.map((c, i) => (
                    <tr key={c.id || i} className="hover:bg-muted/10 transition-colors">
                      <td className="px-5 py-3 text-foreground">{c.name}</td>
                      <td className="px-5 py-3 text-right font-semibold text-primary">
                        {c.precio || "Consultar"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center text-muted-foreground">Precios de compra no disponibles.</div>
            )}
          </div>
          <p className="mt-3 text-xs text-muted-foreground italic">
            * Los precios son orientativos y dependen del estado físico y funcionamiento del equipo.
          </p>
        </motion.div>

        {/* ──────────── 3. Reparación de consolas ──────────── */}
        <motion.div
          id="reparacion"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariant}
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="inline-flex rounded-lg bg-primary/10 p-2 text-primary">
              <Wrench className="h-5 w-5" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-foreground">
              Reparación de Consolas
            </h3>
          </div>
          <p className="mb-6 max-w-xl text-muted-foreground">
            Servicio técnico profesional multimarca. Diagnóstico sin cargo y reparaciones con garantía.
          </p>

          {isLoading ? (
            <LoadingSkeleton count={6} type="pill" />
          ) : reparacionModelos.length > 0 ? (
            <div className="grid gap-3 grid-cols-2 lg:grid-cols-3">
              {reparacionModelos.map((m) => (
                <div
                  key={m.id || m.modelo}
                  className="rounded-lg border border-border bg-card px-3 py-3 sm:px-5 sm:py-4 text-xs sm:text-sm font-medium text-foreground transition-all hover:border-primary/40 hover:bg-muted/20 text-center flex items-center justify-center min-h-[60px]"
                >
                  {m.modelo}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-10 rounded-xl border border-dashed border-border">
              No hay modelos de reparación listados.
            </p>
          )}
        </motion.div>

        {/* ──────────── 4. Destraba de consolas ──────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariant}
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="inline-flex rounded-lg bg-primary/10 p-2 text-primary">
              <Unlock className="h-5 w-5" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-foreground">
              Destraba de Consolas
            </h3>
          </div>
          <p className="mb-6 max-w-xl text-muted-foreground">
            Software y hardware modding para que aproveches al máximo tu consola portátil o de mesa.
          </p>

          <div className="overflow-hidden rounded-xl border border-border bg-card">
            {isLoading ? (
              <LoadingSkeleton count={3} type="row" />
            ) : destrabaModelos.length > 0 ? (
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/40 font-heading">
                  <tr>
                    <th className="px-5 py-3 font-semibold text-foreground border-b border-border">Modelo</th>
                    <th className="px-5 py-3 text-right font-semibold text-foreground border-b border-border">Precio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {destrabaModelos.map((d, i) => (
                    <tr key={d.id || i} className="hover:bg-muted/10 transition-colors">
                      <td className="px-5 py-3 text-foreground">{d.modelo}</td>
                      <td className="px-5 py-3 text-right font-semibold text-primary">
                        {d.precio || "Consultar"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center text-muted-foreground">Precios de destraba no disponibles.</div>
            )}
          </div>
        </motion.div>

        {/* ──────────── CTA WhatsApp ──────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariant}
          className="text-center pt-8"
        >
          <WhatsAppButton size="lg" text="Consultá por WhatsApp ahora" />
        </motion.div>
      </div>
    </section>
  );
};

export default ConsolasSection;
