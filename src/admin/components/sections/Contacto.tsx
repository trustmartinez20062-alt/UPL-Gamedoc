import { useState, useEffect } from "react";
import { Phone, Save, MapPin, Link, Clock } from "lucide-react";
import { useContacto, type ContactoInfo } from "../../store";
import PageHeader from "../PageHeader";

export default function Contacto() {
  const [contacto, setContacto] = useContacto();
  const [form, setForm] = useState<ContactoInfo>({
    direccion: "",
    telefono: "",
    horario: "",
    whatsapp: "",
    mapaEmbed: "",
  });

  const [saved, setSaved] = useState(false);

  const extractSrc = (value: string) => {
    if (value.includes("<iframe") && value.includes("src=\"")) {
      const match = value.match(/src="([^"]+)"/);
      if (match && match[1]) {
        return match[1];
      }
    }
    return value;
  };

  // Sync state correctly when component loads
  useEffect(() => {
    setForm({
      ...contacto,
      mapaEmbed: extractSrc(contacto.mapaEmbed)
    });
  }, [contacto]);

  const handleSave = () => {
    setContacto(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const hasChanges = JSON.stringify(form) !== JSON.stringify(contacto);

  return (
    <div className="animate-fade-in max-w-5xl">
      <PageHeader
        icon={Phone}
        title="Opciones de Contacto"
        description="Administra los datos de ubicación, redes y mapa del sitio."
        action={
          <button
            onClick={handleSave}
            disabled={!hasChanges && !saved}
            className={`flex items-center gap-2 py-2 px-6 rounded-lg font-semibold text-sm transition-all duration-300 ${
              saved 
                ? "bg-emerald-500 text-emerald-950" 
                : hasChanges 
                  ? "bg-[hsl(175_80%_50%)] text-[hsl(220_20%_6%)] shadow-[0_0_20px_hsl(175_80%_50%_/_0.3)]" 
                  : "bg-[hsl(220_15%_18%)] text-[hsl(215_15%_45%)] cursor-not-allowed"
            }`}
          >
            <Save size={16} /> {saved ? "¡Cambios Guardados!" : "Guardar Cambios"}
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-xl border p-6" style={{ background: "hsl(220 18% 10%)", borderColor: "hsl(220 15% 18%)" }}>
            <h3 className="mb-6 font-bold text-lg flex items-center gap-2" style={{ color: "hsl(210 20% 92%)" }}>
              <Link size={18} className="text-primary" />
              Información del Local
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "hsl(215 15% 55%)" }}>
                  Dirección Física
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(215_15%_40%)]" size={16} />
                  <input
                    className="input-field pl-10"
                    value={form.direccion}
                    onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                    placeholder="Ej: Juan José Castro 2381, Montevideo"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "hsl(215 15% 55%)" }}>
                  Teléfono de Contacto (Visible)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(215_15%_40%)]" size={16} />
                  <input
                    className="input-field pl-10"
                    value={form.telefono}
                    onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                    placeholder="Ej: 096 593 154"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "hsl(215 15% 55%)" }}>
                  Horario de Atención
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 text-[hsl(215_15%_40%)]" size={16} />
                  <textarea
                    className="input-field pl-10 h-24 pt-2"
                    value={form.horario}
                    onChange={(e) => setForm({ ...form, horario: e.target.value })}
                    placeholder="Ej: Lunes a Sábado — Consultá disponibilidad"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "hsl(215 15% 55%)" }}>
                  Enlace Directo de WhatsApp
                </label>
                <input
                  className="input-field"
                  value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                  placeholder="https://wa.me/598..."
                />
                <p className="mt-2 text-[10px]" style={{ color: "hsl(215 15% 45%)" }}>
                  Asegúrate de incluir el código de país. Ejemplo: https://wa.me/59891234567
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border p-6" style={{ background: "hsl(220 18% 10%)", borderColor: "hsl(220 15% 18%)" }}>
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="text-primary" size={18} />
              <h3 className="font-bold text-lg" style={{ color: "hsl(210 20% 92%)" }}>Ubicación en el Mapa</h3>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "hsl(215 15% 55%)" }}>
                  Google Maps Embed URL
                </label>
                <textarea
                  className="input-field h-24 font-mono text-xs"
                  value={form.mapaEmbed}
                  onChange={(e) => {
                    const value = e.target.value;
                    setForm({ ...form, mapaEmbed: extractSrc(value) });
                  }}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                />
                <div className="mt-3 p-3 rounded-lg bg-[hsl(220_15%_14%)] text-[10px] leading-relaxed" style={{ color: "hsl(215_15%_50%)" }}>
                  <p className="font-bold mb-1 text-[hsl(215_15%_60%)]">¿Cómo obtener el enlace?</p>
                  1. Ve a Google Maps.<br/>
                  2. Busca tu ubicación.<br/>
                  3. Compartir {'>'} Insertar un mapa.<br/>
                  4. Copia el valor del atributo <strong>src="..."</strong> únicamente.
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "hsl(215 15% 55%)" }}>
                  Vista Previa del Mapa
                </label>
                {form.mapaEmbed ? (
                  <div className="w-full aspect-video rounded-lg overflow-hidden border" style={{ borderColor: 'hsl(220 15% 22%)' }}>
                    <iframe
                      key={form.mapaEmbed}
                      src={form.mapaEmbed}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Preview Maps"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-video rounded-lg border border-dashed flex items-center justify-center text-sm" style={{ borderColor: 'hsl(220 15% 22%)', color: 'hsl(215 15% 55%)' }}>
                    Sin mapa configurado
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
