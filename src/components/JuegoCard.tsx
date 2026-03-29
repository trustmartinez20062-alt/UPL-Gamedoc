import { motion } from "framer-motion";
import { usePlataformas, type Juego } from "../admin/store";

interface JuegoCardProps extends Juego {
  index: number;
}

const JuegoCard = ({ name, plataformas, image, precio, index }: JuegoCardProps) => {
  const [allPlataformas] = usePlataformas();
  
  const platformNames = (plataformas || [])
    .map(id => allPlataformas.find(p => p.id === id)?.name)
    .filter(Boolean)
    .join(" / ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative flex flex-col overflow-hidden rounded-xl sm:rounded-2xl border border-border bg-card transition-all hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10"
    >
      <div className="aspect-[3/4] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col p-2.5 sm:p-4">
        <h4 className="mb-0.5 sm:mb-1 font-heading text-sm sm:text-lg font-bold text-foreground line-clamp-1">{name}</h4>
        <p className="mb-2 sm:mb-4 text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {platformNames || "Sin plataforma"}
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-border pt-2 sm:pt-3">
          <span className="text-base sm:text-xl font-bold text-primary text-glow">{precio}</span>
        </div>
      </div>
    </motion.div>
  );
};
export default JuegoCard;
