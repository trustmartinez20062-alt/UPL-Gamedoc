import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Home, AlertTriangle } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 blur-3xl opacity-20 bg-primary rounded-full" />
        <AlertTriangle className="relative mx-auto h-24 w-24 text-primary animate-pulse-subtle" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-4 font-heading text-6xl font-black tracking-tighter text-foreground sm:text-8xl"
      >
        404
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-12 space-y-4"
      >
        <h2 className="font-heading text-2xl font-bold text-primary text-glow uppercase tracking-wide">
          Misión Fallida: Página No Encontrada
        </h2>
        <p className="mx-auto max-w-md text-lg text-muted-foreground">
          Parece que te has desviado del mapa. La página que buscas no existe o ha sido reubicada.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-bold text-primary-foreground transition-all hover:scale-105 hover:box-glow active:scale-95"
        >
          <Home className="h-5 w-5" />
          Volver al Inicio
        </Link>
      </motion.div>

      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50" />
    </div>
  );
};

export default NotFound;
