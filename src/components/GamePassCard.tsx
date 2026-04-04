import { motion } from "framer-motion";
import { type GamePassPlan } from "../admin/store";

interface GamePassCardProps extends GamePassPlan {
  index: number;
}

const GamePassCard = ({ plan, precio, type, index }: GamePassCardProps) => {
  const isConsultar = !precio || precio.toLowerCase().includes("consultar");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5"
    >
      <div className="aspect-[16/10] overflow-hidden relative">
        {type?.image ? (
          <img
            src={type.image}
            alt={type.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-muted/20 flex items-center justify-center">
             <span className="text-muted-foreground/10 font-black text-6xl italic tracking-tighter">GP</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/20 to-transparent" />
        
        {/* Badge flotante de tipo */}
        <div className="absolute top-3 left-3 px-2 py-1 rounded bg-primary/90 text-[10px] font-black text-white uppercase tracking-wider backdrop-blur-sm shadow-xl">
           {type?.name || "Pase"}
        </div>
      </div>
      
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          {type?.prefix || "Game Pass"}
        </div>
        <h4 className="mb-4 font-heading text-lg font-black text-foreground group-hover:text-primary transition-colors">
          {type?.name || "Plan"} <span className="text-muted-foreground/50 font-medium lowercase">({plan})</span>
        </h4>
        
        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          <span className={`font-black text-primary text-glow ${isConsultar ? "text-sm" : "text-xl sm:text-2xl"}`}>
            {isConsultar ? "Consultar" : precio}
          </span>
          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:rotate-12 transition-all duration-300">
            <span className="text-lg font-black">+</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GamePassCard;
