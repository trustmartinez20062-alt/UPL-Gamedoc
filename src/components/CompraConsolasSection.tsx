import { motion } from "framer-motion";
import { DollarSign } from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";
import { useConsolasCompra } from "../admin/store";

const CompraConsolasSection = () => {
  const [consolasCompra] = useConsolasCompra();
  
  return (
  <section id="compra" className="py-24 bg-card/10">
    <div className="container">
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-2 text-primary">
          <DollarSign className="h-6 w-6" />
        </div>
        <h2 className="mb-4 font-heading text-3xl font-bold text-foreground sm:text-4xl">
          ¿Querés vender tu <span className="text-primary text-glow">consola</span>?
        </h2>
        <p className="mx-auto max-w-lg text-muted-foreground">
          Compramos consolas usadas en efectivo. Tasación rápida y segura. Precios de referencia:
        </p>
      </div>

      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border bg-card/50 shadow-xl backdrop-blur-sm">
        <div className="max-h-[530px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left text-sm sm:text-base relative">
            <thead className="sticky top-0 z-10 bg-[hsl(220_15%_10%)] font-heading text-xs uppercase tracking-wider text-muted-foreground border-b border-border shadow-sm">
              <tr>
                <th className="px-6 py-4 font-semibold">Modelo</th>
                <th className="px-6 py-4 text-right font-semibold">Precio aprox.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {consolasCompra.map((c, i) => (
                <tr key={c.id || c.name} className="group transition-colors hover:bg-muted/10">
                  <td className="px-6 py-4 font-medium text-foreground">{c.name}</td>
                  <td className="px-6 py-4 text-right font-bold text-primary">{c.precio || "Consultar"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-12 text-center">
        <WhatsAppButton size="lg" text="Cotizar mi consola" />
        <p className="mt-4 text-xs text-muted-foreground italic">
          * Los precios pueden variar según el estado físico, funcionamiento y accesorios incluidos.
        </p>
      </div>
    </div>
  </section>
  );
};

export default CompraConsolasSection;
