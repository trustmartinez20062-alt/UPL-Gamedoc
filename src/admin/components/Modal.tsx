import { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ title, onClose, children }: ModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-md rounded-2xl border animate-fade-in shadow-2xl"
        style={{
          background: "hsl(220 18% 10%)",
          borderColor: "hsl(220 15% 22%)",
          boxShadow: "0 25px 50px hsl(0 0% 0% / 0.6), 0 0 40px hsl(175 80% 50% / 0.08)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "hsl(220 15% 18%)" }}
        >
          <h3
            className="font-bold text-base"
            style={{ fontFamily: "Orbitron, sans-serif", color: "hsl(210 20% 92%)" }}
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            className="transition-colors hover:opacity-70 p-1 rounded-lg"
            style={{ color: "hsl(215 15% 55%)" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 max-h-[80vh] overflow-y-auto custom-scrollbar">{children}</div>
      </div>
    </div>
  );
}
