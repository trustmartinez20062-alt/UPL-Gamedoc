import { motion } from "framer-motion";
import { Star } from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";

const products = [
  {
    name: "PlayStation 5",
    category: "Consola",
    price: "Consultar",
    badge: "Popular",
    emoji: "🎮",
  },
  {
    name: "Xbox Series X",
    category: "Consola",
    price: "Consultar",
    badge: "Disponible",
    emoji: "🕹️",
  },
  {
    name: "Nintendo Switch OLED",
    category: "Consola",
    price: "Consultar",
    badge: "Nuevo",
    emoji: "🎯",
  },
  {
    name: "Game Pass Ultimate",
    category: "Suscripción",
    price: "Consultar",
    badge: "Oferta",
    emoji: "⚡",
  },
  {
    name: "FIFA / EA FC 25",
    category: "Juego Digital",
    price: "Consultar",
    badge: "Top Ventas",
    emoji: "⚽",
  },
  {
    name: "GTA V Online",
    category: "Juego Digital",
    price: "Consultar",
    badge: "Clásico",
    emoji: "🚗",
  },
];

const ProductsSection = () => (
  <section id="productos" className="py-24">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 text-center"
      >
        <h2 className="mb-4 font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Productos <span className="text-primary text-glow">Destacados</span>
        </h2>
        <p className="mx-auto max-w-md text-muted-foreground">
          Precios por mayor y menor. Consultanos por disponibilidad y ofertas.
        </p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/40"
          >
            {/* Badge */}
            <div className="absolute right-3 top-3 rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
              {p.badge}
            </div>

            <div className="flex flex-col items-center p-8 text-center">
              <span className="mb-4 text-5xl">{p.emoji}</span>
              <span className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{p.category}</span>
              <h3 className="mb-2 font-heading text-lg font-bold text-foreground">{p.name}</h3>
              <div className="mb-1 flex items-center gap-1 text-primary">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5" fill="currentColor" />
                ))}
              </div>
              <span className="mb-4 text-sm text-muted-foreground">{p.price}</span>
              <WhatsAppButton size="sm" text="Consultar" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ProductsSection;
