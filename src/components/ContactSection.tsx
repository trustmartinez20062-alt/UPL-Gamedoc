import { motion } from "framer-motion";
import { MapPin, Phone, Clock } from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";

const ContactSection = () => (
  <section id="contacto" className="py-24 gradient-dark">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 text-center"
      >
        <h2 className="mb-4 font-heading text-3xl font-bold text-foreground sm:text-4xl">
          <span className="text-primary text-glow">Contacto</span>
        </h2>
        <p className="mx-auto max-w-md text-muted-foreground">
          ¿Tenés alguna consulta? Escribinos por WhatsApp y te respondemos al instante.
        </p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
            <MapPin className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
            <div>
              <h3 className="font-heading text-sm font-semibold text-foreground">Dirección</h3>
              <p className="text-sm text-muted-foreground">Juan José Castro 2381, Montevideo, Uruguay</p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
            <Phone className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
            <div>
              <h3 className="font-heading text-sm font-semibold text-foreground">Teléfono / WhatsApp</h3>
              <a href="tel:+59896593154" className="text-sm text-primary hover:underline">096 593 154</a>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
            <Clock className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
            <div>
              <h3 className="font-heading text-sm font-semibold text-foreground">Horario</h3>
              <p className="text-sm text-muted-foreground">Lunes a Sábado — Consultá disponibilidad</p>
            </div>
          </div>

          <WhatsAppButton size="lg" text="Escribinos por WhatsApp" className="w-full justify-center" />
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-xl border border-border"
        >
          <iframe
            title="Ubicación de Game Doctor"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3272.0!2d-56.17!3d-34.87!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDUyJzEyLjAiUyA1NsKwMTAnMTIuMCJX!5e0!3m2!1ses!2suy!4v1"
            width="100%"
            height="100%"
            className="min-h-[320px]"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </div>
    </div>
  </section>
);

export default ContactSection;
