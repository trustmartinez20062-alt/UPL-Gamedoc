import { motion } from "framer-motion";
import { DollarSign } from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";

const consolasCompra = [
  { name: "PlayStation 4 Slim", precio: "$4.000" },
  { name: "PlayStation 4 Pro", precio: "$5.500" },
  { name: "PlayStation 5", precio: "$12.000" },
  { name: "Xbox One S", precio: "$3.500" },
  { name: "Xbox One X", precio: "$4.500" },
  { name: "Xbox Series S", precio: "$6.000" },
  { name: "Xbox Series X", precio: "$10.000" },
  { name: "Nintendo Switch", precio: "$4.000" },
  { name: "Nintendo Switch OLED", precio: "$6.000" },
];

const CompraConsolasSection = () => (
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
        <table className="w-full text-left text-sm sm:text-base">
          <thead className="bg-muted/40 font-heading text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-6 py-4 font-semibold">Modelo</th>
              <th className="px-6 py-4 text-right font-semibold">Precio aprox.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {consolasCompra.map((c, i) => (
              <tr key={c.name} className="group transition-colors hover:bg-muted/10">
                <td className="px-6 py-4 font-medium text-foreground">{c.name}</td>
                <td className="px-6 py-4 text-right font-bold text-primary">{c.precio}</td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default CompraConsolasSection;
