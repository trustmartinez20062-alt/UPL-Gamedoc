import { motion } from "framer-motion";
import { Monitor, ArrowLeft, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useConsolasVenta } from "../admin/store";
import ConsolaCard from "@/components/ConsolaCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEOHead from "@/components/SEOHead";
import { useEffect, useState } from "react";

const Consolas = () => {
  const [consolas] = useConsolasVenta();
  const [search, setSearch] = useState("");

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filtered = consolas.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.estado?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* @SEO Metadata única para /consolas */}
      <SEOHead
        title="Venta de Consolas en Montevideo — PlayStation, Xbox, Nintendo | Game Doctor"
        description="Comprá consolas PlayStation, Xbox y Nintendo nuevas, restauradas y usadas con garantía en La Unión, Montevideo, Uruguay. Precios mayoristas y minoristas. Tomamos tu consola como parte de pago."
        canonical="https://gamedoctor.uy/consolas"
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
                Volver al inicio
              </Link>
            </motion.div>

            {/* Header — @SEO H1 optimizado con ubicación */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="inline-flex rounded-xl bg-primary/10 p-3 text-primary shadow-lg shadow-primary/20">
                      <Monitor className="h-8 w-8" />
                    </div>
                    <h1 className="font-heading text-4xl font-bold text-foreground sm:text-5xl">
                      Venta de <span className="text-primary text-glow">Consolas</span> en Montevideo
                    </h1>
                  </div>
                  <p className="max-w-2xl text-lg text-muted-foreground">
                    Encontrá tu próxima consola al mejor precio. Nuevas, restauradas y usadas con garantía
                  </p>
                </div>

                {/* Search */}
                <div className="relative w-full max-w-sm">
                  <input
                    type="text"
                    placeholder="Buscar consola..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-xl border border-border bg-card/50 px-5 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40 backdrop-blur-sm"
                  />
                </div>
              </div>
            </motion.div>

            {/* Grid */}
            {filtered.length > 0 ? (
              <div className="grid gap-3 sm:gap-6 grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                {filtered.map((c, i) => (
                  <ConsolaCard key={c.id || c.name} {...c} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-card rounded-2xl border border-border">
                <Monitor size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground">No se encontraron consolas que coincidan con tu búsqueda.</p>
              </div>
            )}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mt-16 rounded-3xl border border-primary/20 bg-primary/5 p-8 text-center sm:p-12"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ShoppingCart className="h-8 w-8" />
              </div>
              <h2 className="mb-4 font-heading text-2xl font-bold text-foreground sm:text-3xl">
                ¿Buscás una consola en particular?
              </h2>
              <p className="mx-auto mb-8 max-w-md text-muted-foreground">
                Tomamos consolas como parte de pago y conseguimos modelos a pedido. ¡Consultanos por WhatsApp!
              </p>
              <WhatsAppButton size="lg" text="Consultar por Consolas" />
            </motion.div>

            {/* @SEO Contenido descriptivo para crawlers — posicionado al final de la página */}
            <div className="mt-16 max-w-4xl mx-auto">
              <p className="text-sm leading-relaxed text-muted-foreground/60">
                En <strong>Game Doctor</strong> ofrecemos la mejor selección de consolas de videojuegos en <strong>La Unión, Montevideo</strong>. 
                Trabajamos con <strong>PlayStation 3, PlayStation 4, PlayStation 5, Xbox One, Xbox Series S, Xbox Series X y Nintendo Switch</strong>. 
                Todas nuestras consolas restauradas pasan por un proceso completo de diagnóstico, limpieza interna, cambio de pasta térmica 
                y pruebas de funcionamiento antes de la venta. Ofrecemos <strong>garantía</strong> en cada equipo y aceptamos consolas como 
                parte de pago. También contamos con stock de consolas nuevas selladas a precios competitivos tanto para venta minorista como 
                mayorista. Si buscás una consola específica que no ves en nuestro catálogo, <Link to="/#contacto" className="text-primary hover:underline font-medium">contactanos por WhatsApp</Link> y 
                te la conseguimos. Hacemos envíos a todo Uruguay.
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

export default Consolas;
