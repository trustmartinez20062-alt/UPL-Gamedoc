import { motion } from "framer-motion";
import { Gamepad2, CreditCard, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useJuegos, useGamePass } from "../admin/store";
import JuegoCard from "./JuegoCard";
import GamePassCard from "./GamePassCard";
import WhatsAppButton from "./WhatsAppButton";

const sectionVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const JuegosSection = () => {
  const [juegos] = useJuegos();
  const [gamePassPlanes] = useGamePass();
  const displayedJuegos = juegos.slice(0, 4);
  const hasMoreJuegos = juegos.length > 4;
  
  const displayedGamePass = gamePassPlanes.slice(0, 4);
  const hasMorePasses = gamePassPlanes.length > 4;

  return (
    <section id="juegos" className="py-12 gradient-dark">
      <div className="container space-y-16">
        {/* ──────────── Título principal ──────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariant}
          className="text-center"
        >
          <h2 className="mb-4 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Catálogo <span className="text-primary text-glow">Digital</span>
          </h2>
          <p className="mx-auto max-w-lg text-muted-foreground">
            Explorá nuestra selección de juegos digitales y suscripciones premium para Xbox y PlayStation.
          </p>
        </motion.div>

        {/* ──────────── 1. Venta de juegos digitales ──────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariant}
        >
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="inline-flex rounded-lg bg-primary/10 p-2 text-primary">
                <Gamepad2 className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground">
                Juegos Digitales
              </h3>
            </div>
            
            {hasMoreJuegos && (
              <Link 
                to="/juegos-digitales" 
                className="text-sm font-bold text-primary hover:text-primary/80 transition-all hidden sm:flex items-center gap-1 group"
              >
                Ver catálogo completo <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
            {displayedJuegos.map((j, i) => (
              <JuegoCard key={j.id} {...j} index={i} />
            ))}
          </div>
          
          {hasMoreJuegos && (
            <div className="mt-12 flex justify-center">
              <Link 
                to="/juegos-digitales" 
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-8 py-4 text-lg font-semibold text-secondary-foreground transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary hover:box-glow"
              >
                Ver todos los juegos
              </Link>
            </div>
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
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="inline-flex rounded-lg bg-primary/10 p-2 text-primary">
                <CreditCard className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground">
                Game Pass & Suscripciones
              </h3>
            </div>
            
            {hasMorePasses && (
              <Link 
                to="/game-pass" 
                className="text-sm font-bold text-primary hover:text-primary/80 transition-all hidden sm:flex items-center gap-1 group"
              >
                Ver todos los pases <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {displayedGamePass.map((g, i) => (
              <GamePassCard key={g.id} {...g} index={i} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default JuegosSection;
