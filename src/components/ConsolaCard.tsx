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
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-3 sm:p-5 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
    >
      {estado && (
        <div className={`absolute right-2 top-2 z-10 rounded-full px-2 py-0.5 text-[10px] sm:text-xs font-semibold backdrop-blur-md ${getEstadoStyles(estado)}`}>
          {estado}
        </div>
      )}
      <div className="mb-3 flex-shrink-0 aspect-video overflow-hidden rounded-md bg-muted/20">
        <img 
          src={image} 
          alt={name} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="flex-1 flex flex-col">
        <h3 className="text-sm sm:text-base font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {name}
        </h3>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest" style={{ color: version === "Destrabada" ? "hsl(280 80% 65%)" : "hsl(215 15% 55%)" }}>
            {version || "Original"}
          </p>
          <span className="text-[10px] text-muted-foreground/30">•</span>
          <p className="text-[10px] sm:text-[11px] font-semibold" style={{ color: "hsl(175 80% 60%)" }}>
            {garantia ? `${garantia} de garantía` : "Sin garantía"}
          </p>
        </div>
        
        {info && (
          isTruncated ? (
            <HoverCard openDelay={200} closeDelay={100}>
              <HoverCardTrigger asChild>
                <div className="cursor-help relative">
                  {/* Pseudo-elemento sutil para indicar expansible */}
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
                    <p className="text-[10px] mt-1 font-black uppercase tracking-widest" style={{ color: version === "Destrabada" ? "hsl(280 80% 65%)" : "hsl(215 15% 55%)" }}>
                      {version || "Original"} - {estado}
                    </p>
                    <p className="text-[10px] mt-0.5 font-semibold" style={{ color: "hsl(175 80% 60%)" }}>
                      {garantia ? `${garantia} de garantía` : "Sin garantía"}
                    </p>
                  </div>
                  
                  <div className="h-px w-full bg-border" />
                  
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {info}
                  </p>
                </div>
                {/* Glow decorativo de fondo en el hover */}
                <div className="absolute -inset-10 bg-primary/5 blur-2xl top-0 pointer-events-none rounded-full" />
              </HoverCardContent>
            </HoverCard>
          ) : (
            <InfoText />
          )
        )}
        
        <div className="mt-auto pt-2">
          <p className="text-xs sm:text-sm font-bold text-primary">
            {isConsultar ? "Consultar precio" : precio}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ConsolaCard;
