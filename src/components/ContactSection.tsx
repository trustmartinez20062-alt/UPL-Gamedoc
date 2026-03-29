import { motion } from "framer-motion";
import { MapPin, Phone, Clock } from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";
import { useContacto } from "../admin/store";

const ContactSection = () => {
  const [contacto] = useContacto();

  return (
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
                <p className="text-sm text-muted-foreground">{contacto.direccion}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
              <Phone className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
              <div>
                <h3 className="font-heading text-sm font-semibold text-foreground">Teléfono / WhatsApp</h3>
                <a href={contacto.whatsapp} className="text-sm text-primary hover:underline">{contacto.telefono}</a>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
              <Clock className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
              <div>
                <h3 className="font-heading text-sm font-semibold text-foreground">Horario</h3>
                <p className="text-sm text-muted-foreground">{contacto.horario}</p>
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
            {contacto.mapaEmbed ? (
              <iframe
                title="Ubicación de Game Doctor"
                src={contacto.mapaEmbed}
                width="100%"
                height="450"
                className="w-full h-full"
                style={{ border: 0, minHeight: "450px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="min-h-[450px] flex items-center justify-center bg-muted text-muted-foreground">
                Mapa no configurado
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
