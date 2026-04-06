import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, CheckCircle2, ChevronRight } from "lucide-react";
import { type ConsolaVenta } from "../admin/store";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface ConsolaCardProps extends ConsolaVenta {
  index: number;
}

const ConsolaCard = ({ name, image, estado, version, info, garantia, precio, mercadolibre_url, index }: ConsolaCardProps) => {
  const isConsultar = !precio || precio.toLowerCase().includes("consultar");
  const infoRef = useRef<HTMLParagraphElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Detectamos si el contenedor del texto está desbordando al usar line-clamp
    const checkTruncation = () => {
      if (infoRef.current) {
        setIsTruncated(infoRef.current.scrollHeight > infoRef.current.clientHeight);
      }
    };
    
    checkTruncation();
    // Re-evaluar en resize de ventana
    window.addEventListener("resize", checkTruncation);
    return () => window.removeEventListener("resize", checkTruncation);
  }, [info]);

  const InfoText = () => (
    <p 
      ref={infoRef}
      className="mt-1.5 text-[11px] sm:text-xs text-muted-foreground line-clamp-2 leading-relaxed"
    >
      {info}
    </p>
  );

  const getEstadoStyles = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case "nueva":
        return "bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]";
      case "restaurada":
        return "bg-purple-500/20 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.2)]";
      case "usada":
        return "bg-yellow-500/20 text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.2)]";
      default:
        return "bg-primary/20 text-primary shadow-primary/10";
    }
  };

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
        <div className="aspect-[16/13] overflow-hidden relative">
          <img 
            src={image} 
            alt={name} 
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/20 to-transparent" />
          
          {estado && (
            <div className={`absolute top-3 left-3 z-10 px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-xl ${getEstadoStyles(estado)}`}>
              {estado}
            </div>
          )}
          
          {/* Overlay de Ver Detalles para Mobile */}
          <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none md:hidden">
            <span className="bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest text-primary border border-primary/20 shadow-xl">
              Ver Detalles
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            {version || "Consola"} {garantia && `• ${garantia} GTÍA`}
          </div>
          
          <h3 className="mb-4 font-heading text-lg font-black text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {name}
          </h3>
          
          {info && (
            <div className="mb-4" onClick={(e) => e.stopPropagation()}>
              {isTruncated ? (
                <HoverCard openDelay={200} closeDelay={100}>
                  <HoverCardTrigger asChild>
                    <div className="cursor-help relative">
                      <div className="absolute -inset-1 rounded opacity-0 group-hover:opacity-10 transition-opacity bg-primary" />
                      <InfoText />
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent 
                    side="top" 
                    align="start" 
                    className="w-72 bg-card border-primary/20 shadow-xl shadow-primary/10 overflow-hidden"
                  >
                    <div className="space-y-2 relative z-10">
                      <div>
                        <h3 className="text-sm font-bold text-foreground leading-tight">{name}</h3>
                        <p className="text-[10px] mt-1 font-black uppercase tracking-widest text-primary">
                          {version || "Original"} - {estado}
                        </p>
                      </div>
                      
                      <div className="h-px w-full bg-border" />
                      
                      <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto custom-scrollbar pr-2">
                        {info}
                      </p>
                    </div>
                    <div className="absolute -inset-10 bg-primary/5 blur-2xl top-0 pointer-events-none rounded-full" />
                  </HoverCardContent>
                </HoverCard>
              ) : (
                <InfoText />
              )}
            </div>
          )}
          
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
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 text-white/70 hover:text-white transition-colors backdrop-blur-md"
              >
                <X size={20} />
              </button>

              {/* Flex Child 1: Image container */}
              <div className="h-44 sm:h-60 w-full shrink-0 relative">
                 <img src={image} alt={name} className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              </div>

              {/* Flex Child 2: Content (Scrollable text only) */}
              <div className="flex flex-col flex-1 p-4 sm:p-6 overflow-hidden min-h-0">
                <div className="shrink-0 mb-3">
                  <div className="flex flex-wrap items-center gap-2.5 mb-2">
                      <div className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${getEstadoStyles(estado)}`}>
                        {estado}
                      </div>
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{version || "Original"}</span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-heading font-black text-foreground leading-none">
                    {name}
                  </h2>

                  {garantia && (
                    <div className="flex items-center gap-2 mt-3 p-2 rounded-xl bg-primary/5 border border-primary/10 w-fit">
                        <ShieldCheck size={14} className="text-primary" />
                        <span className="text-[9px] font-bold text-primary uppercase">Garantía: {garantia} DE GTÍA</span>
                    </div>
                  )}
                </div>

                {/* Sub-container for description which consumes remaining height and adds scroll */}
                <div className="flex flex-col flex-1 overflow-hidden min-h-0 min-h-[4rem]">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-2 shrink-0">
                    <CheckCircle2 size={12} className="text-primary" />
                    Especificaciones y Detalles
                  </h3>
                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-2">
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {info || "No hay información adicional disponible para esta consola."}
                    </p>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mt-3 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                     <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Precio Final</p>
                     <p className="text-xl sm:text-2xl font-black text-primary text-glow leading-none">
                       {isConsultar ? "Consulte Precio" : precio}
                     </p>
                  </div>

                  <div className="flex flex-col gap-2.5 w-full sm:w-auto">
                    <a
                      href={isConsultar 
                        ? `https://wa.me/59896593154?text=Hola!%20Quiero%20consultar%20el%20precio%20de%20la%20consola%20${encodeURIComponent(name)}` 
                        : `https://wa.me/59896593154?text=Hola!%20Me%20interesa%20la%20consola%20${encodeURIComponent(name)}%20de%20${encodeURIComponent(precio)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-6 py-3 bg-[#25D366] text-white text-sm font-black uppercase tracking-tighter rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(37,211,102,0.3)] text-center"
                    >
                      Consultar por WhatsApp
                    </a>

                    {mercadolibre_url && (
                      <a
                        href={mercadolibre_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full px-6 py-3 bg-[#FFE600] text-[#333333] text-sm font-black uppercase tracking-tighter rounded-xl hover:scale-105 active:scale-95 transition-all text-center"
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

export default ConsolaCard;
