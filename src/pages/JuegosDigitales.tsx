import { motion } from "framer-motion";
import { Gamepad2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useJuegos } from "../admin/store";
import JuegoCard from "@/components/JuegoCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEOHead from "@/components/SEOHead";
import { useEffect } from "react";

const JuegosDigitales = () => {
  const [juegos] = useJuegos();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* @SEO Metadata única para /juegos-digitales */}
      <SEOHead
        title="Juegos Digitales en Uruguay — PS4, PS5, Xbox, PC | Game Doctor"
        description="Catálogo de juegos digitales al mejor precio en Uruguay. Juegos para PlayStation 4, PS5, Xbox y PC con entrega inmediata. Comprá seguro en Game Doctor, La Unión, Montevideo."
        canonical="https://gamedoctor.uy/juegos-digitales"
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

            {/* Header Juegos — @SEO H1 optimizado con Uruguay */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="inline-flex rounded-xl bg-primary/10 p-3 text-primary shadow-lg shadow-primary/20">
                  <Gamepad2 className="h-8 w-8" />
                </div>
                <h1 className="font-heading text-4xl font-bold text-foreground sm:text-5xl">
                  <span className="text-primary text-glow">Juegos Digitales</span> en Uruguay
                </h1>
              </div>
              <p className="max-w-2xl text-lg text-muted-foreground">
                Explorá nuestra selección completa de juegos digitales para varias consolas
              </p>
            </motion.div>

            {/* @SEO Contenido descriptivo para crawlers (~160 palabras) */}
            <div className="mb-12 max-w-4xl">
              <p className="text-sm leading-relaxed text-muted-foreground/80">
                <strong>Game Doctor</strong> es tu tienda de <strong>juegos digitales en Uruguay</strong>. Ofrecemos un catálogo actualizado 
                de títulos para <strong>PlayStation 4, PlayStation 5, Xbox One, Xbox Series X|S y PC</strong> a precios accesibles. 
                Todos los juegos se entregan de forma inmediata mediante activación digital, sin necesidad de esperar envíos físicos. 
                Trabajamos con cuentas primarias y secundarias según la plataforma, siempre garantizando la seguridad de tu cuenta. 
                Además de juegos individuales, podés consultar nuestras <Link to="/game-pass" className="text-primary hover:underline font-medium">suscripciones Game Pass</Link> para 
                acceder a cientos de títulos con una sola activación. Si buscás un juego específico que no ves en el catálogo, 
                <Link to="/#contacto" className="text-primary hover:underline font-medium"> escribinos por WhatsApp</Link> y te lo 
                conseguimos. Atendemos desde <strong>La Unión, Montevideo</strong> con envíos digitales a todo el país.
              </p>
            </div>

            {/* Grid Juegos */}
            {juegos.length > 0 ? (
              <div className="grid gap-3 sm:gap-6 grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                {juegos.map((j, i) => (
                  <JuegoCard key={j.id} {...j} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-card/40 rounded-2xl border border-border">
                <Gamepad2 size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground">No hay juegos disponibles en este momento.</p>
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
                ¿Buscás algo más?
              </h2>
              <p className="mx-auto mb-8 max-w-md text-muted-foreground">
                Si no encontrás lo que buscás, ¡preguntanos! Estamos para ayudarte a encontrar el mejor precio.
              </p>
              <WhatsAppButton size="lg" text="Consultar por WhatsApp" />
            </motion.div>
          </div>
        </section>
      </main>


      <Footer />
      <WhatsAppButton floating />
    </div>
  );
};

export default JuegosDigitales;
