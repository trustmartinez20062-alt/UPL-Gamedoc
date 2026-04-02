import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useContacto } from "@/admin/store";

const reviews = [
  { name: "Martín G.", text: "Excelente servicio, me repararon la PS5 en el mismo día. Súper recomendable.", rating: 5 },
  { name: "Carolina S.", text: "Compré juegos digitales y todo perfecto. Precios muy buenos comparados con la competencia.", rating: 5 },
  { name: "Federico L.", text: "Activé el Game Pass Ultimate a un precio increíble. Gran atención por WhatsApp.", rating: 5 },
  { name: "Lucía P.", text: "Llevé mi Nintendo Switch que no cargaba y me la arreglaron al toque. Muy profesionales.", rating: 4 },
];

const ReviewsSection = () => (
  <section className="py-24">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 text-center"
      >
        <h2 className="mb-4 font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Lo que dicen nuestros <span className="text-primary text-glow">clientes</span>
        </h2>
        <div className="mx-auto flex items-center justify-center gap-2">
          <div className="flex text-primary">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5" fill={i < 4 ? "currentColor" : "none"} />
            ))}
          </div>
          <span className="text-lg font-semibold text-foreground">4.4</span>
          <span className="text-muted-foreground">— Más de 300 reseñas</span>
        </div>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {reviews.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <Quote className="mb-3 h-5 w-5 text-primary/40" />
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">"{r.text}"</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">{r.name}</span>
              <div className="flex text-primary">
                {[...Array(r.rating)].map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5" fill="currentColor" />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ReviewsSection;
