import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, Monitor, Wrench, ChevronRight, ShoppingCart, DollarSign, CreditCard, Unlock } from "lucide-react";
import { useJuegos } from "../admin/store";
import JuegoCard from "./JuegoCard";
import WhatsAppButton from "./WhatsAppButton";
import { Link } from "react-router-dom";

/* ── Data to be shown in the tabs ── */
const consolasVenta = [
  { name: "PlayStation 5 Slim", badge: "Disponible", image: "https://placehold.co/600x400/1e293b/FFFFFF?text=PlayStation+5+Slim" },
  { name: "PlayStation 5 Digital", badge: "Agotado", image: "https://placehold.co/600x400/1e293b/FFFFFF?text=PlayStation+5+Digital" },
  { name: "PlayStation 4 Pro (1TB)", badge: "Disponible", image: "https://placehold.co/600x400/1e293b/FFFFFF?text=PS4+Pro+1TB" },
  { name: "PlayStation 4 Slim", badge: "Agotado", image: "https://placehold.co/600x400/1e293b/FFFFFF?text=PS4+Slim" },
  { name: "Xbox Series X", badge: "Disponible", image: "https://placehold.co/600x400/10b981/FFFFFF?text=Xbox+Series+X" },
  { name: "Xbox Series S", badge: "Disponible", image: "https://placehold.co/600x400/10b981/FFFFFF?text=Xbox+Series+S" },
  { name: "Nintendo Switch OLED", badge: "Disponible", image: "https://placehold.co/600x400/ef4444/FFFFFF?text=Nintendo+Switch+OLED" },
  { name: "Nintendo Switch Lite", badge: "Disponible", image: "https://placehold.co/600x400/ef4444/FFFFFF?text=Nintendo+Switch+Lite" },
];

const reparacionModelos = [
  "PlayStation 4 / Slim / Pro (Service & HDMI)",
  "PlayStation 5 / Slim / Digital (Liquid Metal)",
  "Xbox One S / X",
  "Xbox Series S / X",
  "Nintendo Switch / OLED / Lite (Batería & Joycon)",
  "Controles (PS4, PS5, Xbox Series)",
];

const destrabaModelos = [
  { modelo: "PlayStation 4 (todas las versiones)", precio: "$2.500" },
  { modelo: "Nintendo Switch / OLED (V1, V2, OLED)", precio: "$3.000" },
  { modelo: "Xbox 360", precio: "$1.500" },
];

const gamePassPlanes = [
  { plan: "Game Pass Core (1 mes)", precio: "$350" },
  { plan: "Game Pass Core (3 meses)", precio: "$900" },
  { plan: "Game Pass Core (12 meses)", precio: "$2.500" },
  { plan: "Game Pass Ultimate (1 mes)", precio: "$600" },
  { plan: "Game Pass Ultimate (3 meses)", precio: "$1.600" },
];

const ShopTabs = () => {
  const [activeTab, setActiveTab] = useState("juegos");
  const [juegos] = useJuegos();
  const displayedJuegos = juegos.slice(0, 4);

  const tabs = [
    { id: "juegos", label: "Juegos", icon: Gamepad2 },
    { id: "consolas", label: "Consolas", icon: Monitor },
    { id: "passes", label: "Pases", icon: CreditCard },
    { id: "servicios", label: "Servicios", icon: Wrench },
  ];

  return (
    <section id="tienda" className="py-24 gradient-dark overflow-hidden">
      <div className="container">
        {/* ... (Titles and Tab Selector same as before) ... */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Nuestra <span className="text-primary text-glow">Tienda</span>
          </h2>
          <p className="mx-auto max-w-lg text-muted-foreground">
            Elegí una categoría para explorar nuestro catálogo completo y servicios técnicos profesionales.
          </p>
        </div>

        <div className="mb-10 flex justify-center px-4">
          <div className="flex w-full max-w-2xl gap-2 rounded-2xl border border-border bg-card/50 p-1.5 shadow-xl backdrop-blur-sm sm:gap-4">
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

        <div className="min-h-[500px]">
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
                   <div className="flex items-center gap-3">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                    <h3 className="font-heading text-xl font-bold text-foreground sm:text-2xl">Venta de Consolas</h3>
                  </div>
                  <div className="grid gap-3 sm:gap-6 grid-cols-2 lg:grid-cols-4">
                    {consolasVenta.map((c, i) => (
                      <div key={c.name} className="group relative overflow-hidden rounded-xl border border-border bg-card p-3 sm:p-5 transition-all hover:border-primary/40">
                         <div className="absolute right-2 top-2 z-10 rounded-full bg-primary/20 px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-primary">
                          {c.badge}
                        </div>
                        <div className="mb-3 aspect-video overflow-hidden rounded-md bg-muted/20">
                          <img src={c.image} alt={c.name} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-foreground line-clamp-1">{c.name}</h4>
                        <p className="mt-1 text-xs text-muted-foreground">Consultar precio</p>
                      </div>
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
                <div className="mx-auto max-w-2xl space-y-8">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-6 w-6 text-primary" />
                    <h3 className="font-heading text-2xl font-bold text-foreground">Suscripciones & Pases</h3>
                  </div>
                  <div className="max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                    <div className="overflow-hidden rounded-2xl border border-border bg-card/40 shadow-xl backdrop-blur-sm">
                      <table className="w-full text-left text-sm sm:text-base">
                        <thead className="bg-muted/40 font-heading text-xs uppercase tracking-wider text-muted-foreground">
                          <tr>
                            <th className="px-6 py-4 font-semibold">Plan / Suscripción</th>
                            <th className="px-6 py-4 text-right font-semibold">Precio</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {gamePassPlanes.map((g, i) => (
                            <tr key={g.plan} className="group transition-colors hover:bg-muted/10">
                              <td className="px-6 py-4 font-medium text-foreground">{g.plan}</td>
                              <td className="px-6 py-4 text-right font-bold text-primary">{g.precio}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="text-center">
                    <WhatsAppButton size="lg" text="Activar mi Pase" />
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
                        <li key={m} className="flex items-center gap-2 rounded-lg bg-muted/20 px-4 py-3 text-xs sm:text-sm font-medium text-foreground">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {m}
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
                        <div key={d.modelo} className="flex items-center justify-between rounded-lg border border-primary/10 bg-card p-4 transition-all hover:border-primary/30">
                          <span className="text-xs sm:text-sm font-semibold">{d.modelo}</span>
                          <span className="text-sm font-bold text-primary">{d.precio}</span>
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
