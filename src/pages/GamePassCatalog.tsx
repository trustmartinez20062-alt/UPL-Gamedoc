import { motion } from "framer-motion";
import { CreditCard, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useGamePass } from "../admin/store";
import GamePassCard from "@/components/GamePassCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEOHead from "@/components/SEOHead";
import { useEffect } from "react";

const GamePassCatalog = () => {
  const [gamePassPlanes] = useGamePass();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* @SEO Metadata única para /game-pass */}
      <SEOHead
        title="Game Pass Uruguay — Suscripciones Xbox y PlayStation | Game Doctor"
        description="Activá Game Pass Ultimate, Core y suscripciones PlayStation Plus al mejor precio en Uruguay. Activación inmediata con garantía. Game Doctor, La Unión, Montevideo."
        canonical="https://gamedoctor.uy/game-pass"
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
              <div className="flex items-center gap-4 mb-4">
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
            </motion.div>

            {/* @SEO Contenido descriptivo para crawlers (~170 palabras) */}
            <div className="mb-12 max-w-4xl">
              <p className="text-sm leading-relaxed text-muted-foreground/80">
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

            {/* Grid Game Pass */}
            {gamePassPlanes.length > 0 ? (
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {gamePassPlanes.map((g, i) => (
                  <GamePassCard key={g.id} {...g} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-card/40 rounded-2xl border border-border">
                <CreditCard size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground">No hay pases disponibles en este momento.</p>
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
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton floating />
    </div>
  );
};

export default GamePassCatalog;
