import { MessageCircle } from "lucide-react";
import { useContacto } from "../admin/store";

interface WhatsAppButtonProps {
  text?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  floating?: boolean;
}

const sizeClasses = {
  sm: "px-4 py-2 text-sm gap-2",
  md: "px-6 py-3 text-base gap-2",
  lg: "px-8 py-4 text-lg gap-3",
};

const WhatsAppButton = ({ text = "Contactar por WhatsApp", className = "", size = "md", floating = false }: WhatsAppButtonProps) => {
  const [contacto] = useContacto();
  const WHATSAPP_URL = contacto.whatsapp || "https://wa.me/59896593154";

  if (floating) {
    return (
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-whatsapp animate-pulse-glow transition-transform hover:scale-110"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="h-8 w-8 text-whatsapp-foreground" fill="currentColor" />
      </a>
    );
  }

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center rounded-lg bg-whatsapp font-semibold text-whatsapp-foreground transition-all hover:scale-105 box-glow-whatsapp ${sizeClasses[size]} ${className}`}
    >
      <MessageCircle className="h-5 w-5" fill="currentColor" />
      {text}
    </a>
  );
};

export default WhatsAppButton;
