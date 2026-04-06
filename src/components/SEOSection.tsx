import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const SEOSection = () => (
  <section className="py-12 bg-background/50">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto text-center"
      >
        <p className="text-sm leading-relaxed text-muted-foreground/70">
          <strong>Game Doctor</strong> es tu centro especializado en <strong>reparación de consolas en Montevideo</strong>. 
          Ubicados en <strong>La Unión</strong>, ofrecemos servicio técnico profesional para <strong>PlayStation</strong> (PS3, PS4, PS5), 
          <strong>Xbox</strong> (360, One, Series X|S) y <strong>Nintendo Switch</strong>. Realizamos reparaciones de puerto HDMI, 
          fallas de placa, errores de disco, limpieza interna profunda, cambio de pasta térmica y 
          reemplazo de componentes. También brindamos servicio de <strong>destraba y liberación de consolas</strong> con 
          software actualizado y garantía. Además de nuestro taller, contamos con una{" "}
          <Link to="/consolas" className="text-primary hover:underline font-medium">tienda de consolas nuevas y restauradas</Link>, 
          un amplio <Link to="/juegos-digitales" className="text-primary hover:underline font-medium">catálogo de juegos digitales</Link> y 
          activación de <Link to="/game-pass" className="text-primary hover:underline font-medium">Game Pass y suscripciones</Link> al 
          mejor precio. Todos nuestros trabajos incluyen garantía y diagnóstico sin costo. Consultanos por WhatsApp 
          para presupuestos personalizados. Atendemos venta mayorista y minorista con envíos a todo Uruguay.
        </p>
      </motion.div>
    </div>
  </section>
);

export default SEOSection;
