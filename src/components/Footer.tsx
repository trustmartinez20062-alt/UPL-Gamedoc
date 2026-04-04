import { Facebook, Instagram, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useContacto } from "../admin/store";

const Footer = () => {
  const [contacto] = useContacto();

  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand + SEO text */}
          <div>
            <span className="font-heading text-lg font-bold tracking-wider text-primary text-glow">GAME DOCTOR</span>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Reparación y venta de consolas en La Unión, Montevideo, Uruguay. 
              Servicio técnico profesional para PlayStation, Xbox y Nintendo con garantía.
            </p>
          </div>

          {/* @SEO Internal links con anchor text rico en keywords */}
          <div>
            <h3 className="font-heading text-sm font-bold text-foreground mb-3 uppercase tracking-wider">Catálogo</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/consolas" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Venta de consolas en Montevideo
                </Link>
              </li>
              <li>
                <Link to="/juegos-digitales" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Juegos digitales Uruguay
                </Link>
              </li>
              <li>
                <Link to="/game-pass" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Game Pass y suscripciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Social links */}
          <div className="flex flex-col items-start md:items-end gap-4">
            <h3 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider">Seguinos</h3>
            <div className="flex items-center gap-3">
              <a
                href={contacto.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                aria-label="Facebook de Game Doctor"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={contacto.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-pink-500/40 hover:text-pink-500"
                aria-label="Instagram de Game Doctor"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={contacto.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-whatsapp/40 hover:text-whatsapp"
                aria-label="WhatsApp de Game Doctor"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Game Doctor — Reparación y venta de consolas en Montevideo, Uruguay. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
