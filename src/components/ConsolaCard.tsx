import { motion } from "framer-motion";
import { type ConsolaVenta } from "../admin/store";

interface ConsolaCardProps extends ConsolaVenta {
  index: number;
}

const ConsolaCard = ({ name, image, badge, index }: ConsolaCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-xl border border-border bg-card p-3 sm:p-5 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
    >
      {badge && (
        <div className="absolute right-2 top-2 z-10 rounded-full bg-primary/20 px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-primary backdrop-blur-md">
          {badge}
        </div>
      )}
      <div className="mb-3 aspect-video overflow-hidden rounded-md bg-muted/20">
        <img 
          src={image} 
          alt={name} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
      </div>
      <h4 className="text-sm sm:text-base font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
        {name}
      </h4>
      <p className="mt-1 text-xs text-muted-foreground">Consultar precio</p>
    </motion.div>
  );
};

export default ConsolaCard;
