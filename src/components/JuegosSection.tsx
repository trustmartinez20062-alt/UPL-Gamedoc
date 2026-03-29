import { motion } from "framer-motion";
import { Gamepad2, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { useJuegos, usePlataformas } from "../admin/store";
import JuegoCard from "./JuegoCard";
import WhatsAppButton from "./WhatsAppButton";

const sectionVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const JuegosSection = () => {
  // @DB-DYNAMIC-DATA: Este hook ya está preparado para consumir datos, solo falta conectar useJuegos() a Supabase en store.ts.
  const [juegos] = useJuegos();
  const [allPlataformas] = usePlataformas();
  const displayedJuegos = juegos.slice(0, 4);
  const hasMore = juegos.length > 4;

  // @DB-DYNAMIC-DATA: Los precios de Game Pass deberían ser gestionados desde la base de datos.
  const gamePassPlanes = [
    { plan: "Game Pass Core (1 mes)", precio: "$350" },
    { plan: "Game Pass Core (3 meses)", precio: "$900" },
    { plan: "Game Pass Core (12 meses)", precio: "$2.500" },
    { plan: "Game Pass Ultimate (1 mes)", precio: "$600" },
    { plan: "Game Pass Ultimate (3 meses)", precio: "$1.600" },
  ];

  return (
    <section id="juegos" className="py-12 gradient-dark">
      <div className="container space-y-8">
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
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="inline-flex rounded-lg bg-primary/10 p-2 text-primary">
                <Gamepad2 className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground">
                Venta de Juegos Digitales
              </h3>
            </div>
            
            {hasMore && (
              <Link 
                to="/juegos-digitales" 
                className="text-sm font-medium text-primary hover:text-primary/80 transition-all hidden sm:block underline-offset-4 hover:underline"
              >
                Ver catálogo completo →
              </Link>
            )}
          </div>

          <div className="grid gap-3 sm:gap-6 grid-cols-2 lg:grid-cols-4">
            {displayedJuegos.map((j, i) => (
              <JuegoCard key={j.id} {...j} index={i} />
            ))}
          </div>
          
          {hasMore && (
            <div className="mt-12 flex justify-center">
              <Link 
                to="/juegos-digitales" 
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-8 py-4 text-lg font-semibold text-secondary-foreground transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary hover:box-glow"
              >
                Ver todos los juegos
              </Link>
            </div>
          )}
          
          {!hasMore && (
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Tenemos muchos más títulos disponibles. ¡Preguntanos por el que
              buscás!
            </p>
          )}
        </motion.div>

        {/* ──────────── 2. Game Pass ──────────── */}
        <motion.div
          id="passes"
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
};

export default JuegosSection;
