import { motion } from "framer-motion";
import { Gamepad2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useJuegos } from "../admin/store";
import JuegoCard from "@/components/JuegoCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useEffect } from "react";

const JuegosDigitales = () => {
  const [juegos] = useJuegos();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
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
                to="/#juegos" 
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft size={16} />
                Volver al inicio
              </Link>
            </motion.div>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-16"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="inline-flex rounded-xl bg-primary/10 p-3 text-primary shadow-lg shadow-primary/20">
                  <Gamepad2 className="h-8 w-8" />
                </div>
                <h1 className="font-heading text-4xl font-bold text-foreground sm:text-5xl">
                  Catálogo de <span className="text-primary text-glow">Juegos Digitales</span>
                </h1>
              </div>
              <p className="max-w-2xl text-lg text-muted-foreground">
                Explorá nuestra selección completa de juegos digitales para PS4, PS5, Xbox y PC. 
                Todos con garantía y entrega inmediata.
              </p>
            </motion.div>

            {/* Grid */}
            {juegos.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                {juegos.map((j, i) => (
                  <JuegoCard key={j.id} {...j} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-card rounded-2xl border border-border">
                <Gamepad2 size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground">No hay juegos disponibles en este momento.</p>
              </div>
            )}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mt-12 rounded-3xl border border-primary/20 bg-primary/5 p-8 text-center sm:p-12"
            >
              <h2 className="mb-4 font-heading text-2xl font-bold text-foreground sm:text-3xl">
                ¿No encontrás el juego que buscás?
              </h2>
              <p className="mx-auto mb-8 max-w-md text-muted-foreground">
                Tenemos muchos más títulos en stock. ¡Consultanos y conseguimos el que necesitás al mejor precio!
              </p>
              <WhatsAppButton size="lg" text="Preguntar por un juego" />
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
