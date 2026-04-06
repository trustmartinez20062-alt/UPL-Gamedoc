import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useContacto } from "@/admin/store";
import { Skeleton } from "@/components/ui/skeleton";

const AboutSection = () => {
  const [contacto, , query] = useContacto();

  const handleTextFormat = (text: string) => {
    return text.split('\n').map((paragraph, index) => (
      paragraph.trim() ? (
        <p key={index} className="mb-4 leading-relaxed text-muted-foreground whitespace-pre-wrap">
          {paragraph}
        </p>
      ) : null
    ));
  };

  if (query.isLoading) {
    return (
      <section id="nosotros" className="py-24 gradient-dark">
        <div className="container">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Skeleton className="h-10 w-1/2 mb-6" />
              <div className="space-y-4 mb-8">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[80%]" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[...Array(6)].map((_, i) => (
                   <div key={i} className="flex items-center gap-3">
                     <Skeleton className="h-6 w-6 rounded-full" />
                     <Skeleton className="h-4 w-32" />
                   </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <Skeleton className="h-[400px] w-full max-w-[400px] rounded-[36px]" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  const points = contacto.sobre_nosotros_ticks || [];
  const text = contacto.sobre_nosotros_texto || "";
  const imageUrl = contacto.sobre_nosotros_imagen || "";

  return (
    <section id="nosotros" className="py-24 gradient-dark">
      <div className="container">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 font-heading text-3xl font-bold text-foreground sm:text-4xl w-fit">
              Sobre <span className="text-primary text-glow font-black border-b-[3px] border-primary pb-1 inline-block">Game Doctor</span>
            </h2>
            
            {text ? (
              <div className="mb-8">
                {handleTextFormat(text)}
              </div>
            ) : null}
            {points.length > 0 && (
              <ul className="grid gap-4 sm:grid-cols-2 mt-6">
                {points.map((p, idx) => (
                  <motion.li
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    key={idx} 
                    className="flex items-start gap-3 items-center group"
                  >
                    <div className="bg-primary/10 p-1.5 rounded-full group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground tracking-wide leading-snug">{p}</span>
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center relative mt-8 lg:mt-0"
          >
            {/* Background glowing blur for visual effect */}
            <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] bg-primary/20 blur-[80px] rounded-full z-0 pointer-events-none" />

            {imageUrl ? (
              <div className="relative z-10 p-2 sm:p-3 rounded-2xl sm:rounded-[36px] bg-gradient-to-br from-card/80 to-card/20 backdrop-blur-lg border border-primary/20 box-glow overflow-hidden group w-full max-w-[400px]">
                  <img 
                    src={imageUrl} 
                    alt="Game Doctor — tienda de reparación y venta de consolas en La Unión, Montevideo" 
                    className="relative z-10 w-full aspect-[4/5] sm:aspect-square object-cover rounded-xl sm:rounded-[24px] shadow-2xl transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 rounded-[36px] pointer-events-none z-20" />
              </div>
            ) : (
              <div className="relative z-10 flex h-[280px] w-full max-w-[280px] items-center justify-center rounded-2xl border border-primary/30 bg-card/80 backdrop-blur-sm box-glow sm:h-[400px] sm:max-w-[400px] hover:border-primary/50 hover:shadow-[0_0_40px_hsl(175,80%,50%,0.2)] transition-all duration-500">
                <div className="text-center group">
                  <span className="block font-heading text-[100px] font-black text-primary/80 group-hover:text-primary text-glow sm:text-[140px] leading-none tracking-tighter drop-shadow-2xl transition-colors duration-500">GD</span>
                  <span className="mt-4 block font-heading text-sm font-bold tracking-[0.4em] text-primary/60 group-hover:text-primary/90 transition-colors duration-500">GAME DOCTOR</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
