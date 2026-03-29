import { motion } from "framer-motion";
import { Gamepad2, CreditCard } from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";

/* ── Juegos digitales ── */
const juegos = [
  { name: "EA FC 25", plataforma: "PS4 / PS5", image: "https://placehold.co/300x400/1e293b/FFFFFF?text=EA+FC+25" },
  { name: "GTA V Online", plataforma: "PS4 / PS5 / Xbox", image: "https://placehold.co/300x400/1e293b/FFFFFF?text=GTA+V+Online" },
  { name: "Call of Duty: MW III", plataforma: "PS4 / PS5 / Xbox", image: "https://placehold.co/300x400/1e293b/FFFFFF?text=Call+of+Duty+MW+III" },
  { name: "Spider-Man 2", plataforma: "PS5", image: "https://placehold.co/300x400/1e293b/FFFFFF?text=Spider-Man+2" },
  { name: "Hogwarts Legacy", plataforma: "PS4 / PS5 / Xbox", image: "https://placehold.co/300x400/1e293b/FFFFFF?text=Hogwarts+Legacy" },
  { name: "Minecraft", plataforma: "Todas las plataformas", image: "https://placehold.co/300x400/1e293b/FFFFFF?text=Minecraft" },
  { name: "Fortnite V-Bucks", plataforma: "Todas las plataformas", image: "https://placehold.co/300x400/1e293b/FFFFFF?text=Fortnite" },
  { name: "NBA 2K25", plataforma: "PS4 / PS5 / Xbox", image: "https://placehold.co/300x400/1e293b/FFFFFF?text=NBA+2K25" },
];

/* ── Game Pass ── */
const gamePassPlanes = [
  { plan: "Game Pass Core (1 mes)", precio: "$350" },
  { plan: "Game Pass Core (3 meses)", precio: "$900" },
  { plan: "Game Pass Core (12 meses)", precio: "$2.500" },
  { plan: "Game Pass Ultimate (1 mes)", precio: "$600" },
  { plan: "Game Pass Ultimate (3 meses)", precio: "$1.600" },
];

const sectionVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const JuegosSection = () => (
  <section id="juegos" className="py-24 gradient-dark">
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
          <span className="text-primary text-glow">Juegos</span>
        </h2>
        <p className="mx-auto max-w-lg text-muted-foreground">
          Catálogo de juegos digitales y suscripciones Game Pass a los mejores
          precios.
        </p>
      </motion.div>

      {/* ──────────── 1. Venta de juegos digitales ──────────── */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariant}
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="inline-flex rounded-lg bg-primary/10 p-2 text-primary">
            <Gamepad2 className="h-5 w-5" />
          </div>
          <h3 className="font-heading text-2xl font-bold text-foreground">
            Venta de Juegos Digitales
          </h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {juegos.map((j, i) => (
            <motion.div
              key={j.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card p-5 text-center transition-all hover:border-primary/40"
            >
              <div className="mb-4 aspect-[3/4] overflow-hidden rounded-md">
                <img src={j.image} alt={j.name} className="h-full w-full object-cover" />
              </div>
              <h4 className="font-heading text-base font-semibold text-foreground">
                {j.name}
              </h4>
              <p className="mt-1 text-xs text-muted-foreground">
                {j.plataforma}
              </p>
              <p className="mt-2 text-sm font-medium text-primary">
                Consultar precio
              </p>
            </motion.div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Tenemos muchos más títulos disponibles. ¡Preguntanos por el que
          buscás!
        </p>
      </motion.div>

      {/* ──────────── 2. Game Pass ──────────── */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariant}
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="inline-flex rounded-lg bg-primary/10 p-2 text-primary">
            <CreditCard className="h-5 w-5" />
          </div>
          <h3 className="font-heading text-2xl font-bold text-foreground">
            Game Pass
          </h3>
        </div>
        <p className="mb-6 max-w-xl text-muted-foreground">
          Activamos tu suscripción Game Pass al mejor precio. Accedé a cientos
          de juegos en Xbox y PC.
        </p>

        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-5 py-3 font-heading font-semibold text-foreground">
                  Plan
                </th>
                <th className="px-5 py-3 text-right font-heading font-semibold text-foreground">
                  Precio
                </th>
              </tr>
            </thead>
            <tbody>
              {gamePassPlanes.map((g, i) => (
                <tr
                  key={g.plan}
                  className={i % 2 === 0 ? "bg-card" : "bg-muted/20"}
                >
                  <td className="px-5 py-3 text-foreground">{g.plan}</td>
                  <td className="px-5 py-3 text-right font-semibold text-primary">
                    {g.precio}
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

export default JuegosSection;
