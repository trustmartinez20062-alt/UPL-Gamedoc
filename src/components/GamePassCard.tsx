import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Zap } from "lucide-react";
import { type GamePassPlan } from "../admin/store";

interface GamePassCardProps extends GamePassPlan {
  index: number;
}

const GamePassCard = ({ plan, precio, type, mercadolibre_url, index }: GamePassCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isConsultar = !precio || precio.toLowerCase().includes("consultar");

  const whatsappMessage = isConsultar
    ? `Hola! Quiero consultar el precio del plan ${plan} de ${type?.name || "Game Pass"}`
    : `Hola! Me interesa el plan ${plan} de ${type?.name || "Game Pass"} por ${precio}`;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        onClick={() => setIsModalOpen(true)}
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 cursor-pointer"
      >
        <div className="aspect-[16/11] overflow-hidden relative">
          {type?.image ? (
            <img
              src={type.image}
              alt={type.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="h-full w-full bg-muted/20 flex items-center justify-center">
               <span className="text-muted-foreground/10 font-black text-6xl italic tracking-tighter">GP</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/20 to-transparent" />
          
          {/* Badge flotante de tipo */}
          <div className="absolute top-3 left-3 px-2 py-1 rounded bg-primary/90 text-[10px] font-black text-white uppercase tracking-wider backdrop-blur-sm shadow-xl z-10">
             {type?.name || "Pase"}
          </div>

          {/* Overlay de Ver Detalles para Mobile */}
          <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none md:hidden">
            <span className="bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest text-primary border border-primary/20 shadow-xl">
              Ver Plan
            </span>
          </div>
        </div>
        
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            {type?.prefix || "Game Pass"}
          </div>
          <h3 className="mb-4 font-heading text-lg font-black text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {type?.name || "Plan"} <span className="text-muted-foreground/50 font-medium lowercase">({plan})</span>
          </h3>
          
          <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
            <span className={`font-black text-primary text-glow ${isConsultar ? "text-sm" : "text-xl sm:text-2xl"}`}>
              {isConsultar ? "Consultar" : precio}
            </span>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-black transition-all">
               <ChevronRight size={18} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modal de Detalles Premium */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-card border border-primary/20 rounded-[2rem] overflow-hidden shadow-2xl shadow-primary/20"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 text-white/70 hover:text-white transition-colors backdrop-blur-md shadow-2xl"
              >
                <X size={20} />
              </button>

              {/* Flex Child 1: Image container */}
              <div className="h-44 sm:h-60 w-full shrink-0 relative">
                 {type?.image ? (
                   <img src={type.image} alt={type.name} className="w-full h-full object-cover" />
                 ) : (
                   <div className="h-full w-full bg-primary/10" />
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                 
                 <div className="absolute bottom-4 left-6 flex items-center gap-2">
                     <div className="px-3 py-1 rounded-full bg-primary text-black text-[10px] font-black uppercase tracking-widest shadow-xl">
                        {type?.name || "Game Pass"}
                     </div>
                 </div>
              </div>

              {/* Flex Child 2: Content */}
              <div className="flex flex-col flex-1 p-5 sm:p-7 overflow-hidden min-h-0">
                <div className="flex items-center gap-2 mb-2 text-primary shrink-0">
                  <Zap size={14} fill="currentColor" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{type?.prefix || "Xbox Gaming"}</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-heading font-black text-foreground mb-6 leading-none shrink-0">
                  {type?.name || "Plan"} <span className="text-muted-foreground/40 font-medium lowercase">({plan})</span>
                </h2>

                <div className="mt-auto border-t border-border pt-5 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-5">
                  <div className="text-center sm:text-left">
                     <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Precio por {plan}</p>
                     <p className="text-xl sm:text-2xl font-black text-primary text-glow leading-none">
                       {isConsultar ? "Consulte Precio" : precio}
                     </p>
                  </div>

                  <div className="flex flex-col gap-2.5 w-full sm:w-auto">
                    <a
                      href={`https://wa.me/59896593154?text=${encodeURIComponent(whatsappMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-6 py-3 bg-[#25D366] text-white text-xs font-black uppercase tracking-tighter rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(37,211,102,0.3)] text-center"
                    >
                      Consultar por WhatsApp
                    </a>

                    {mercadolibre_url && (
                      <a
                        href={mercadolibre_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full px-6 py-3 bg-[#FFE600] text-[#333333] text-xs font-black uppercase tracking-tighter rounded-xl hover:scale-105 active:scale-95 transition-all text-center"
                      >
                        Ver en Mercado Libre
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GamePassCard;
