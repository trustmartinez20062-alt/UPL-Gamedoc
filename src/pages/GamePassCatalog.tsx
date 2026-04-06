import { motion } from "framer-motion";
import { CreditCard, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import GamePassCard from "@/components/GamePassCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEOHead from "@/components/SEOHead";
import { useEffect, useState, useMemo } from "react";
import { useGamePass, useGamePassTypes } from "../admin/store";
import { Skeleton } from "@/components/ui/skeleton";

const GamePassCatalog = () => {
  const [gamePassPlanes, , query] = useGamePass();
  const [types] = useGamePassTypes();
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const toggleType = (id: string) => {
    setSelectedTypes(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filtered = useMemo(() => {
    return gamePassPlanes.filter(p => 
      selectedTypes.length === 0 || (p.type_id && selectedTypes.includes(p.type_id))
    );
  }, [gamePassPlanes, selectedTypes]);

  return (
    <div className="min-h-screen bg-background">
      {/* @SEO Metadata única para /game-pass */}
      <SEOHead
        title="Game Pass Uruguay — Suscripciones Xbox y PlayStation | Game Doctor"
        description="Activá Game Pass Ultimate, Core y suscripciones PlayStation Plus al mejor precio en Uruguay. Activación inmediata con garantía. Game Doctor, La Unión, Montevideo."
        canonical="https://gamedoctor.uy/game-pass"
        ogImage="https://gamedoctor.uy/assets/hero-bg.jpg"
      />
      <Navbar />
      
      <main className="pt-24 pb-20">
        <section className="py-12 gradient-dark">
          <div className="container">
            {/* Breadcrumbs / Back button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8"
            >
              <Link 
                to="/#tienda" 
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft size={16} />
                Volver a la tienda
              </Link>
            </motion.div>

            {/* Header Game Pass — @SEO H1 optimizado con Uruguay */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="inline-flex rounded-xl bg-primary/10 p-3 text-primary shadow-lg shadow-primary/20">
                      <CreditCard className="h-8 w-8" />
                    </div>
                    <h1 className="font-heading text-4xl font-bold text-foreground sm:text-5xl">
                       <span className="text-primary text-glow">Game Pass</span> y Suscripciones en Uruguay
                    </h1>
                  </div>
                  <p className="max-w-2xl text-lg text-muted-foreground">
                    Disfrutá de cientos de juegos al instante. Activamos tu suscripción en el momento con garantía total.
                  </p>
                </div>

                {/* Filter Checks */}
                <div className="flex flex-wrap gap-3 items-center">
                  {types.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => toggleType(t.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-300 backdrop-blur-sm ${
                        selectedTypes.includes(t.id)
                          ? "border-primary bg-primary/20 text-primary shadow-lg shadow-primary/20"
                          : "border-border bg-card/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      <div className={`h-4 w-4 rounded border flex items-center justify-center transition-colors ${
                        selectedTypes.includes(t.id) ? "bg-primary border-primary" : "border-muted-foreground/30"
                      }`}>
                        {selectedTypes.includes(t.id) && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-3 h-3 text-white">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      {t.prefix} {t.name}
                    </button>
                  ))}
                  {selectedTypes.length > 0 && (
                    <button 
                      onClick={() => setSelectedTypes([])}
                      className="text-xs text-muted-foreground hover:text-primary underline underline-offset-4 ml-2 transition-colors"
                    >
                      Limpiar filtros
                    </button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Grid Game Pass */}
            {query.isLoading ? (
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="rounded-3xl border border-border bg-card p-6 space-y-4">
                    <Skeleton className="h-8 w-1/2 mx-auto" />
                    <Skeleton className="h-24 w-full rounded-2xl" />
                    <Skeleton className="h-10 w-full rounded-xl" />
                  </div>
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((g, i) => (
                  <GamePassCard key={g.id} {...g} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-card/40 rounded-2xl border border-border">
                <CreditCard size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground">
                  {selectedTypes.length > 0 
                    ? "No se encontraron pases con los filtros seleccionados." 
                    : "No hay pases disponibles en este momento."}
                </p>
              </div>
            )}

            {/* CTA Final */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mt-24 rounded-3xl border border-primary/20 bg-primary/5 p-8 text-center sm:p-12"
            >
              <h2 className="mb-4 font-heading text-2xl font-bold text-foreground sm:text-3xl">
                ¿Buscás un plan diferente?
              </h2>
              <p className="mx-auto mb-8 max-w-md text-muted-foreground">
                Activamos cualquier tipo de suscripción para Xbox y PlayStation. ¡Consultanos por WhatsApp y te pasamos presupuesto!
              </p>
              <WhatsAppButton size="lg" text="Consultar Planes Custom" />
            </motion.div>

            {/* @SEO Contenido descriptivo para crawlers — posicionado al final de la página */}
            <div className="mt-16 max-w-4xl mx-auto">
              <p className="text-sm leading-relaxed text-muted-foreground/60">
                En <strong>Game Doctor</strong> ofrecemos la activación de <strong>Game Pass Ultimate, Game Pass Core y PlayStation Plus</strong> al 
                mejor precio en <strong>Uruguay</strong>. Nuestras suscripciones se activan de forma inmediata en tu consola, 
                sin esperas ni complicaciones. Con Game Pass Ultimate accedés a un catálogo de más de 400 juegos para 
                Xbox y PC, incluyendo lanzamientos del día uno. También activamos <strong>PlayStation Plus Essential, Extra y Premium</strong> para 
                que disfrutes de juegos online, títulos gratuitos mensuales y streaming de clásicos. 
                Cada activación incluye <strong>garantía</strong> y soporte personalizado. Si necesitás un plan que no ves en nuestro 
                catálogo, <Link to="/#contacto" className="text-primary hover:underline font-medium">consultanos por WhatsApp</Link> y 
                armamos la mejor opción para vos. Además, podés explorar nuestro <Link to="/juegos-digitales" className="text-primary hover:underline font-medium">catálogo de juegos digitales</Link> o 
                ver las <Link to="/consolas" className="text-primary hover:underline font-medium">consolas disponibles</Link>. 
                Atendemos desde <strong>La Unión, Montevideo</strong>.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton floating />
    </div>
  );
};

export default GamePassCatalog;
