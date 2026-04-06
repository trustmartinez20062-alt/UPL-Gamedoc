import { motion } from "framer-motion";
import { Gamepad2, Shield, Zap } from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => (
  <section id="inicio" className="relative flex min-h-screen items-center overflow-hidden">
    {/* Background */}
    <motion.div 
      initial={{ scale: 1 }}
      animate={{ scale: 1.05 }}
      transition={{ duration: 10, repeat: Infinity, repeatType: "mirror", ease: "linear" }}
      className="absolute inset-0"
    >
      <img
        src={heroBg}
        alt="Consolas de videojuegos — Reparación y Venta en Montevideo"
        className="h-full w-full object-cover"
        width={1920}
        height={1080}
        loading="eager"
        fetchPriority="high"
      />
    </motion.div>
    <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background" />

    <div className="container relative z-10 py-32">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ 
          opacity: 1, 
          y: [0, -12, 0] 
        }}
        transition={{ 
          opacity: { duration: 0.8 },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
        className="max-w-2xl"
      >
        {/* @SEO Ubicación visible para SEO local */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <Zap className="h-4 w-4" /> La Unión, Montevideo, Uruguay
        </div>

        <h1 className="mb-6 font-heading text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Reparación y venta de{" "}
          <span className="text-primary text-glow">consolas</span> en Montevideo
        </h1>

        {/* @SEO Párrafo descriptivo con keywords principales */}
        <p className="mb-8 max-w-lg text-lg text-muted-foreground">
          Servicio técnico especializado en PlayStation, Xbox y Nintendo. Venta de consolas nuevas y restauradas, juegos digitales y activación de Game Pass en La Unión, Montevideo.
        </p>

        <div className="flex flex-wrap gap-4">
          <WhatsAppButton size="lg" text="Escribinos por WhatsApp" />
          <a
            href="#servicios"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-8 py-4 text-lg font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80"
          >
            Ver servicios
          </a>
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex flex-wrap gap-6 text-sm text-muted-foreground"
        >
          <span className="flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> Garantía en cada reparación de consolas</span>
          <span className="flex items-center gap-2"><Gamepad2 className="h-4 w-4 text-primary" /> +300 clientes en Montevideo</span>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
