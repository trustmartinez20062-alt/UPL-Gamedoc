import { useEffect } from "react";
import { motion } from "framer-motion";
import { Facebook, Instagram, MessageCircle, Users, Handshake } from "lucide-react";
import { useContacto } from "../admin/store";

const FacebookSection = () => {
  const [contacto] = useContacto();

  useEffect(() => {
    const loadFacebookSDK = () => {
      if (document.getElementById("facebook-jssdk")) {
        if (window.FB) window.FB.XFBML.parse();
        return;
      }
      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src = "https://connect.facebook.net/es_LA/sdk.js#xfbml=1&version=v20.0";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      document.body.appendChild(script);
    };
    loadFacebookSDK();
  }, []);

  return (
    <section id="noticias" className="py-24 bg-card/10">
      <div className="container">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left Column: Community Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-2 text-primary">
              <Users className="h-5 w-5" />
            </div>
            <h2 className="mb-6 font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Nuestra <span className="text-primary text-glow">Comunidad</span>
            </h2>
            <p className="mb-6 leading-relaxed text-muted-foreground">
              ¡Mantenete al tanto de todas nuestras novedades! En nuestro muro de noticias compartimos 
              nuevos ingresos de juegos y consolas.
            </p>
            <p className="mb-8 leading-relaxed text-muted-foreground">
              Sumate a los cientos de gamers que ya confían en Game Doctor. También podés seguirnos 
              en nuestras otras redes para contenido diario.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <a
                href={contacto.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-all hover:border-primary/40 hover:text-primary hover:box-glow"
              >
                <Facebook className="h-5 w-5" />
                Facebook
              </a>
              <a
                href={contacto.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-all hover:border-pink-500/40 hover:text-pink-500 hover:shadow-[0_0_15px_rgba(236,72,153,0.15)]"
              >
                <Instagram className="h-5 w-5" />
                Instagram
              </a>
              <a
                href={contacto.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-all hover:border-whatsapp/40 hover:text-whatsapp hover:shadow-[0_0_15px_rgba(37,211,102,0.15)]"
              >
                <MessageCircle className="h-5 w-5" />
                Consultas
              </a>
              {contacto.mercadolibre && (
                <a
                  href={contacto.mercadolibre}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-all hover:border-[#FFE600]/40 hover:text-[#FFE600] hover:shadow-[0_0_15px_rgba(255,230,0,0.15)]"
                >
                  <Handshake className="h-5 w-5" />
                  Mercado Libre
                </a>
              )}
            </div>
          </motion.div>

          {/* Right Column: Facebook Wall */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center lg:items-end"
          >
            <div 
              className="relative overflow-hidden rounded-2xl border border-border bg-card/50 shadow-2xl transition-all hover:border-primary/20"
              style={{ maxWidth: '500px', width: '100%' }}
            >
              <div 
                className="fb-page" 
                data-href="https://www.facebook.com/gamedoctor2004" 
                data-tabs="timeline" 
                data-width="500" 
                data-height="500" 
                data-small-header="true" 
                data-adapt-container-width="true" 
                data-hide-cover="false" 
                data-show-facepile="true"
              >
                <blockquote cite="https://www.facebook.com/gamedoctor2004" className="fb-xfbml-parse-ignore">
                  <a href="https://www.facebook.com/gamedoctor2004">Game Doctor</a>
                </blockquote>
              </div>
            </div>
            <p className="mt-4 text-[10px] text-muted-foreground italic lg:text-right">
              * Si no ves las noticias, permití el contenido de terceros en tu navegador.
            </p>
          </motion.div>
        </div>
      </div>

      <div id="fb-root"></div>
    </section>
  );
};

export default FacebookSection;

declare global {
  interface Window {
    FB: any;
  }
}
