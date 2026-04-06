import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, Monitor, Wrench, ChevronRight, ShoppingCart, DollarSign, CreditCard, Unlock } from "lucide-react";
import { useConsolasVenta, useConsolasCompra, useGamePass, useJuegos, usePlataformas, useDestraba, useReparacion } from "../admin/store";
import JuegoCard from "./JuegoCard";
import ConsolaCard from "./ConsolaCard";
import GamePassCard from "./GamePassCard";
import WhatsAppButton from "./WhatsAppButton";
import { Link } from "react-router-dom";

const ShopTabs = () => {
  const [activeTab, setActiveTab] = useState("consolas");
  
  const [juegos] = useJuegos();
  const [consolasVenta] = useConsolasVenta();
  const [consolasCompra] = useConsolasCompra();
  const [gamePassPlanes] = useGamePass();
  const [destrabaModelos] = useDestraba();
  const [reparacionModelos] = useReparacion();
  
  const displayedJuegos = juegos.slice(0, 4);
  const displayedConsolas = consolasVenta.slice(0, 4);
  const displayedGamePass = gamePassPlanes.slice(0, 4);

  const hasMultipleConsolas = consolasVenta.length > 4;
  const hasMultipleGamePass = gamePassPlanes.length > 4;

  const tabs = [
    { id: "consolas", label: "Consolas", icon: Monitor },
    { id: "passes", label: "Pases", icon: CreditCard },
    { id: "juegos", label: "Juegos", icon: Gamepad2 },
    { id: "servicios", label: "Servicios", icon: Wrench },
  ];


  return (
    <section id="tienda" className="py-24 gradient-dark overflow-hidden">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Nuestra <span className="text-primary text-glow">Tienda</span>
          </h2>
          <p className="mx-auto max-w-lg text-muted-foreground">
            Elegí una categoría para explorar nuestro catálogo completo y servicios técnicos profesionales.
          </p>
        </div>

        <div className="mb-10 flex justify-center px-4">
          <div className="grid grid-cols-2 w-full max-w-2xl gap-2 rounded-2xl border border-border bg-card/50 p-1.5 shadow-xl backdrop-blur-sm sm:flex sm:gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all ${
                  activeTab === tab.id ? "text-primary-foreground" : "text-muted-foreground hover:bg-muted/10 hover:text-foreground"
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabBg"
                    className="absolute inset-0 rounded-xl bg-primary shadow-lg shadow-primary/30"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <tab.icon className="relative z-10 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-[680px]">
          <AnimatePresence mode="wait">
            {activeTab === "juegos" && (
              <motion.div
                key="juegos-tab"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-xl font-bold text-foreground sm:text-2xl">Digitales Destacados</h3>
                    <Link to="/juegos-digitales" className="group flex items-center gap-1 text-sm font-semibold text-primary">
                      Ver todo <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                  <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
                    {displayedJuegos.map((j, i) => (
                      <JuegoCard key={j.id} {...j} index={i} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "consolas" && (
              <motion.div
                key="consolas-tab"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="h-5 w-5 text-primary" />
                      <h3 className="font-heading text-xl font-bold text-foreground sm:text-2xl">Venta de Consolas</h3>
                    </div>
                    <Link to="/consolas" className="group flex items-center gap-1 text-sm font-semibold text-primary">
                      Ver todo <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                  <div className="grid gap-3 sm:gap-6 grid-cols-2 lg:grid-cols-4">
                    {displayedConsolas.map((c, i) => (
                      <ConsolaCard key={c.id || c.name} {...c} index={i} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "passes" && (
              <motion.div
                key="passes-tab"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-6 w-6 text-primary" />
                      <h3 className="font-heading text-xl font-bold text-foreground sm:text-2xl">Suscripciones & Pases</h3>
                    </div>
                    {hasMultipleGamePass && (
                      <Link to="/game-pass" className="group flex items-center gap-1 text-sm font-semibold text-primary">
                        Ver todos <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    )}
                  </div>
                  
                  <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
                    {displayedGamePass.map((g, i) => (
                      <GamePassCard key={g.id} {...g} index={i} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "servicios" && (
              <motion.div
                key="servicios-tab"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="grid gap-8 lg:grid-cols-2"
              >
                <div className="rounded-2xl border border-border bg-card/40 p-6 sm:p-8 flex flex-col">
                  <div className="mb-6 flex items-center gap-3">
                    <Wrench className="h-6 w-6 text-primary" />
                    <h3 className="font-heading text-xl font-bold text-foreground">Servicio Técnico</h3>
                  </div>
                  <div className="flex-1 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                      {reparacionModelos.map((m) => (
                        <li key={m.id} className="flex items-center gap-2 rounded-lg bg-muted/20 px-4 py-3 text-xs sm:text-sm font-medium text-foreground">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {m.modelo}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-8">
                    <WhatsAppButton size="lg" text="Consultar Falla" />
                  </div>
                </div>

                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8 flex flex-col">
                  <div className="mb-6 flex items-center gap-3">
                    <Unlock className="h-6 w-6 text-primary" />
                    <h3 className="font-heading text-xl font-bold text-foreground">Destraba & Software</h3>
                  </div>
                  <div className="flex-1 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    <div className="space-y-4">
                      {destrabaModelos.map((d) => (
                        <div key={d.id || d.modelo} className="flex items-center justify-between rounded-lg border border-primary/10 bg-card p-4 transition-all hover:border-primary/30">
                          <span className="text-xs sm:text-sm font-semibold">{d.modelo}</span>
                          <span className="text-sm font-bold text-primary">
                            {d.precio || "Consultar"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-8">
                    <WhatsAppButton size="lg" text="Pedir Destraba" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ShopTabs;
