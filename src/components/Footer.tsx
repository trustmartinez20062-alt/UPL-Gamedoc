import { Facebook, Instagram, MessageCircle } from "lucide-react";
import { useContacto } from "../admin/store";

const Footer = () => {
  const [contacto] = useContacto();

  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="container">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <span className="font-heading text-lg font-bold tracking-wider text-primary text-glow">GAME DOCTOR</span>
            <p className="mt-1 text-sm text-muted-foreground">Venta y reparación de consolas en Montevideo</p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://www.facebook.com/gamedoctor2004/?locale=es_LA"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="https://www.instagram.com/gamedoctor2004?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-pink-500/40 hover:text-pink-500"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href={contacto.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-whatsapp/40 hover:text-whatsapp"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Game Doctor. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
