import { motion } from "framer-motion";
import { Wrench, Gamepad2, CreditCard, Monitor } from "lucide-react";

const services = [
  {
    icon: Wrench,
    title: "Reparación de Consolas",
    desc: "Servicio técnico profesional para PlayStation, Xbox y Nintendo. Diagnóstico rápido y garantía en cada reparación.",
    href: "#reparacion",
  },
  {
    icon: Gamepad2,
    title: "Juegos Digitales",
    desc: "Amplio catálogo de juegos digitales para todas las plataformas. Los mejores precios del mercado.",
    href: "#juegos",
  },
  {
    icon: CreditCard,
    title: "Game Pass Ultimate",
    desc: "Activación de Game Pass Ultimate al mejor precio. Accedé a cientos de juegos en Xbox y PC.",
    href: "#passes",
  },
  {
    icon: Monitor,
    title: "Venta de Consolas",
    desc: "Consolas nuevas y reacondicionadas. PlayStation 5, Xbox Series X|S, Nintendo Switch y más.",
    href: "#venta",
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

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s, i) => (
          <motion.a
            key={s.title}
            href={s.href}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group block rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:box-glow"
          >
            <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <s.icon className="h-6 w-6" />
            </div>
            <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">{s.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
          </motion.a>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;
