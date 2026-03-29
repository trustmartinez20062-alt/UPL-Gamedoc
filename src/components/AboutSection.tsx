import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const points = [
  "Años de experiencia en reparación de consolas",
  "Precios competitivos por mayor y menor",
  "Atención personalizada y rápida",
  "Garantía en todos nuestros servicios",
  "Juegos digitales 100% originales",
  "Ubicación céntrica en Montevideo",
];

const AboutSection = () => (
  <section id="nosotros" className="py-24 gradient-dark">
    <div className="container">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-4 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Sobre <span className="text-primary text-glow">Game Doctor</span>
          </h2>
          <p className="mb-6 leading-relaxed text-muted-foreground">
            Somos una tienda especializada en el mundo gaming ubicada en Montevideo, Uruguay.
            Nos dedicamos a la venta y reparación de consolas PlayStation, Xbox y Nintendo,
            así como a la venta de juegos digitales y suscripciones como Game Pass Ultimate.
          </p>
          <p className="mb-8 leading-relaxed text-muted-foreground">
            Nuestro compromiso es ofrecer el mejor servicio, precios justos y atención
            personalizada. Ya seas un gamer casual o un revendedor, tenemos lo que necesitás.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-2 text-sm text-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {p}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center"
        >
          <div className="relative flex h-64 w-64 items-center justify-center rounded-2xl border border-primary/30 bg-card box-glow sm:h-80 sm:w-80">
            <div className="text-center">
              <span className="block font-heading text-6xl font-black text-primary text-glow sm:text-7xl">GD</span>
              <span className="mt-2 block font-heading text-sm font-semibold tracking-[0.3em] text-muted-foreground">GAME DOCTOR</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default AboutSection;
