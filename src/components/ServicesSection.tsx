import { motion } from "framer-motion";
import { Wrench, Gamepad2, CreditCard, Monitor } from "lucide-react";
import { Link } from "react-router-dom";

// @DB-DYNAMIC-DATA: Esta lista de servicios principales debería ser editable desde el panel/BD.
const services = [
  {
    icon: Wrench,
    title: "Reparación y Destraba de consolas",
    desc: "Servicio técnico profesional para PlayStation, Xbox y Nintendo en Montevideo. Diagnóstico rápido y garantía en cada reparación.",
    link: null,
  },
  {
    icon: Gamepad2,
    title: "Juegos Digitales",
    desc: "Amplio catálogo de juegos digitales para todas las plataformas. Los mejores precios de Uruguay.",
    link: "/juegos-digitales",
  },
  {
    icon: CreditCard,
    title: "Game Pass y Suscripciones",
    desc: "Activación de Game Pass Ultimate, Core y PlayStation Plus al mejor precio en Uruguay.",
    link: "/game-pass",
  },
  {
    icon: Monitor,
    title: "Venta y Compra de consolas",
    desc: "Consolas nuevas y restauradas con garantía. PlayStation, Xbox, Nintendo Switch y más.",
    link: "/consolas",
  },
];

const ServicesSection = () => (
  <section id="servicios" className="py-24 gradient-dark">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 text-center"
      >
        <h2 className="mb-4 font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Nuestros <span className="text-primary text-glow">Servicios</span>
        </h2>
        <p className="mx-auto max-w-md text-muted-foreground">
          Todo lo que necesitás para tu experiencia gaming, en un solo lugar.
        </p>
      </motion.div>

      <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
        {services.map((s, i) => {
          const content = (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group flex flex-col items-center justify-center text-center rounded-xl border border-border bg-card p-4 sm:p-6 transition-all hover:border-primary/20 aspect-square sm:aspect-auto"
            >
              <div className="mb-3 sm:mb-4 inline-flex rounded-lg bg-primary/10 p-2.5 sm:p-3 text-primary transition-colors group-hover:bg-primary/20">
                <s.icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              
              <div className="flex flex-col justify-center min-h-[2.5rem] sm:min-h-[3.5rem] mb-1 sm:mb-2 w-full">
                <h3 className="font-heading text-sm sm:text-lg font-semibold text-foreground line-clamp-2">
                  {s.title}
                </h3>
              </div>
              
              <p className="hidden sm:block text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </motion.div>
          );

          // @SEO Internal linking — las cards de servicios enlazan a sus páginas correspondientes
          return s.link ? (
            <Link key={s.title} to={s.link} className="block">
              {content}
            </Link>
          ) : (
            content
          );
        })}
      </div>


    </div>
  </section>
);

export default ServicesSection;
