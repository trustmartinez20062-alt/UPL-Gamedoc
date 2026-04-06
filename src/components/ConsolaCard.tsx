import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { type ConsolaVenta } from "../admin/store";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface ConsolaCardProps extends ConsolaVenta {
  index: number;
}

const ConsolaCard = ({ name, image, estado, version, info, garantia, precio, index }: ConsolaCardProps) => {
  const isConsultar = !precio || precio.toLowerCase().includes("consultar");
  const infoRef = useRef<HTMLParagraphElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5"
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
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          {version || "Consola"} {garantia && `• ${garantia} GTÍA`}
        </div>
        
        <h3 className="mb-4 font-heading text-lg font-black text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {name}
        </h3>
        
        {info && (
          <div className="mb-4">
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
                    
                    <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
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
        </div>
      </div>
    </motion.div>
  );
};

export default ConsolaCard;
