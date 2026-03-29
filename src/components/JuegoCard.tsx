import { motion } from "framer-motion";

interface JuegoCardProps {
  name: string;
  plataforma: string;
  image: string;
  precio?: string;
  index: number;
}

const JuegoCard = ({ name, plataforma, image, precio, index }: JuegoCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.05 }}
    className="rounded-xl border border-border bg-card p-5 text-center transition-all hover:border-primary/40 group hover:box-glow"
  >
    <div className="mb-4 aspect-[3/4] overflow-hidden rounded-md bg-muted/20">
      <img 
        src={image} 
        alt={name} 
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
      />
    </div>
    <h4 className="font-heading text-base font-semibold text-foreground line-clamp-1">
      {name}
    </h4>
    <p className="mt-1 text-xs text-muted-foreground">
      {plataforma}
    </p>
    <p className="mt-2 text-sm font-medium text-primary">
      {precio || "Consultar precio"}
    </p>
  </motion.div>
);

export default JuegoCard;
