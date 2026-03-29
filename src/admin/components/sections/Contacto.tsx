import { useState } from "react";
import { Phone, MapPin, Clock, Link, Save, CheckCircle } from "lucide-react";
import { useContacto, type ContactoInfo } from "../../store";
import PageHeader from "../PageHeader";

export default function Contacto() {
  const [contacto, setContacto] = useContacto();
  const [form, setForm] = useState<ContactoInfo>(contacto);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setContacto(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const hasChanges = JSON.stringify(form) !== JSON.stringify(contacto);

  const fields: {
    key: keyof ContactoInfo;
    label: string;
    icon: typeof Phone;
    placeholder: string;
    type?: string;
  }[] = [
    { key: "direccion", label: "Dirección", icon: MapPin, placeholder: "Ej: Juan José Castro 2381, Montevideo, Uruguay" },
    { key: "telefono", label: "Teléfono / WhatsApp", icon: Phone, placeholder: "Ej: 096 593 154" },
    { key: "horario", label: "Horario de atención", icon: Clock, placeholder: "Ej: Lunes a Sábado — Consultá disponibilidad" },
    { key: "whatsapp", label: "URL de WhatsApp", icon: Link, placeholder: "https://wa.me/598...", type: "url" },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        icon={Phone}
        title="Contacto"
        description="Editá la información de contacto que aparece en el sitio"
      />

      {/* Preview card */}
      <div
        className="mb-8 rounded-xl border p-6"
        style={{ background: "hsl(175 80% 50% / 0.05)", borderColor: "hsl(175 80% 50% / 0.2)" }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "hsl(175 80% 60%)" }}>
          Vista previa actual
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <MapPin size={16} className="mt-0.5 shrink-0" style={{ color: "hsl(175 80% 55%)" }} />
            <div>
              <p className="text-xs font-semibold mb-0.5" style={{ color: "hsl(215 15% 55%)" }}>Dirección</p>
              <p className="text-sm" style={{ color: "hsl(210 20% 85%)" }}>{contacto.direccion}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone size={16} className="mt-0.5 shrink-0" style={{ color: "hsl(175 80% 55%)" }} />
            <div>
              <p className="text-xs font-semibold mb-0.5" style={{ color: "hsl(215 15% 55%)" }}>Teléfono</p>
              <p className="text-sm" style={{ color: "hsl(210 20% 85%)" }}>{contacto.telefono}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock size={16} className="mt-0.5 shrink-0" style={{ color: "hsl(175 80% 55%)" }} />
            <div>
              <p className="text-xs font-semibold mb-0.5" style={{ color: "hsl(215 15% 55%)" }}>Horario</p>
              <p className="text-sm" style={{ color: "hsl(210 20% 85%)" }}>{contacto.horario}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Link size={16} className="mt-0.5 shrink-0" style={{ color: "hsl(175 80% 55%)" }} />
            <div>
              <p className="text-xs font-semibold mb-0.5" style={{ color: "hsl(215 15% 55%)" }}>WhatsApp URL</p>
              <a
                href={contacto.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm truncate block max-w-xs hover:underline"
                style={{ color: "hsl(175 80% 55%)" }}
              >
                {contacto.whatsapp}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div
        className="rounded-xl border p-6 space-y-5"
        style={{ background: "hsl(220 18% 10%)", borderColor: "hsl(220 15% 18%)" }}
      >
        <h2
          className="text-base font-bold mb-2"
          style={{ fontFamily: "Orbitron, sans-serif", color: "hsl(210 20% 92%)" }}
        >
          Editar Información
        </h2>

        {fields.map(({ key, label, icon: Icon, placeholder, type }) => (
          <div key={key}>
            <label
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-1.5"
              style={{ color: "hsl(215 15% 55%)" }}
            >
              <Icon size={13} />
              {label}
            </label>
            <input
              type={type || "text"}
              className="input-field"
              placeholder={placeholder}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          </div>
        ))}

        <div className="flex items-center gap-4 pt-3">
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex items-center gap-2 py-2.5 px-6 rounded-lg font-semibold text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: saved ? "hsl(142 70% 45%)" : "hsl(175 80% 50%)",
              color: "hsl(220 20% 6%)",
              boxShadow: hasChanges && !saved ? "0 0 20px hsl(175 80% 50% / 0.3)" : "none",
            }}
          >
            {saved ? <CheckCircle size={16} /> : <Save size={16} />}
            {saved ? "¡Guardado!" : "Guardar cambios"}
          </button>

          {hasChanges && !saved && (
            <button
              onClick={() => setForm(contacto)}
              className="text-sm transition-colors"
              style={{ color: "hsl(215 15% 50%)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "hsl(210 20% 75%)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "hsl(215 15% 50%)")}
            >
              Descartar cambios
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
