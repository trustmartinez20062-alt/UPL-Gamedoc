import { motion } from "framer-motion";
import { ShoppingCart, DollarSign, Wrench, Unlock } from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";

/* ── Venta de consolas ── */
const consolasVenta = [
  { name: "PlayStation 5 Slim", badge: "Disponible", emoji: "🎮" },
  { name: "PlayStation 5 Digital", badge: "Disponible", emoji: "🎮" },
  { name: "Xbox Series X", badge: "Disponible", emoji: "🕹️" },
  { name: "Xbox Series S", badge: "Disponible", emoji: "🕹️" },
  { name: "Nintendo Switch OLED", badge: "Disponible", emoji: "🎯" },
  { name: "Nintendo Switch Lite", badge: "Disponible", emoji: "🎯" },
];

/* ── Compra de consolas ── */
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

/* ── Reparación ── */
const reparacionModelos = [
  "PlayStation 4 / Slim / Pro",
  "PlayStation 5 / Slim / Digital",
  "Xbox One S / X",
  "Xbox Series S / X",
  "Nintendo Switch / OLED / Lite",
];

/* ── Destraba ── */
const destrabaModelos = [
  { modelo: "PlayStation 4 (todas las versiones)", precio: "$2.500" },
  { modelo: "Nintendo Switch / OLED", precio: "$3.000" },
  { modelo: "Xbox 360", precio: "$1.500" },
];

const sectionVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ConsolasSection = () => (
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

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {consolasVenta.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 text-center transition-all hover:border-primary/40"
            >
              <div className="absolute right-3 top-3 rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                {c.badge}
              </div>
              <span className="mb-3 block text-4xl">{c.emoji}</span>
              <h4 className="font-heading text-lg font-semibold text-foreground">
                {c.name}
              </h4>
              <p className="mt-1 text-sm text-muted-foreground">
                Consultar precio
              </p>
            </motion.div>
          ))}
        </div>
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
          consolas usadas. Estos son nuestros precios de referencia en pesos
          uruguayos:
        </p>

        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-5 py-3 font-heading font-semibold text-foreground">
                  Modelo
                </th>
                <th className="px-5 py-3 text-right font-heading font-semibold text-foreground">
                  Precio aprox.
                </th>
              </tr>
            </thead>
            <tbody>
              {consolasCompra.map((c, i) => (
                <tr
                  key={c.name}
                  className={i % 2 === 0 ? "bg-card" : "bg-muted/20"}
                >
                  <td className="px-5 py-3 text-foreground">{c.name}</td>
                  <td className="px-5 py-3 text-right font-semibold text-primary">
                    {c.precio}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          * Los precios pueden variar según el estado de la consola y sus
          accesorios.
        </p>
      </motion.div>

      {/* ──────────── 3. Reparación de consolas ──────────── */}
      <motion.div
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
          Reparamos e instalamos componentes de todas las consolas. Servicio
          técnico profesional con diagnóstico rápido y garantía.
        </p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {reparacionModelos.map((m) => (
            <div
              key={m}
              className="rounded-lg border border-border bg-card px-5 py-4 text-sm font-medium text-foreground transition-all hover:border-primary/40"
            >
              {m}
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Consultanos por WhatsApp para diagnóstico y presupuesto sin cargo.
        </p>
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
          Destrabamos tu consola para que puedas aprovecharla al máximo.
        </p>

        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-5 py-3 font-heading font-semibold text-foreground">
                  Modelo
                </th>
                <th className="px-5 py-3 text-right font-heading font-semibold text-foreground">
                  Precio
                </th>
              </tr>
            </thead>
            <tbody>
              {destrabaModelos.map((d, i) => (
                <tr
                  key={d.modelo}
                  className={i % 2 === 0 ? "bg-card" : "bg-muted/20"}
                >
                  <td className="px-5 py-3 text-foreground">{d.modelo}</td>
                  <td className="px-5 py-3 text-right font-semibold text-primary">
                    {d.precio}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ──────────── CTA WhatsApp ──────────── */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariant}
        className="text-center"
      >
        <WhatsAppButton size="lg" text="Consultá por WhatsApp" />
      </motion.div>
    </div>
  </section>
);

export default ConsolasSection;
