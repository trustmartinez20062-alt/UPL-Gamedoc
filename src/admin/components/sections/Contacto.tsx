import { useState, useEffect, useRef } from "react";
import { Phone, Save, MapPin, Link, Clock, Plus, Trash2, ImagePlus, Loader2, X } from "lucide-react";
import { useContacto, type ContactoInfo } from "../../store";
import { uploadImage, deleteImageFromStorage } from "../../../lib/db";
import PageHeader from "../PageHeader";

export default function Contacto() {
  const [contacto, setContacto] = useContacto();
  const [form, setForm] = useState<ContactoInfo>({
    direccion: "",
    telefono: "",
    horario: "",
    whatsapp: "",
    mapaEmbed: "",
    sobre_nosotros_texto: "",
    sobre_nosotros_ticks: [],
    sobre_nosotros_imagen: "",
  });

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractSrc = (value: string) => {
    let finalUrl = value.trim();

    // Si es un bloque de iframe, extraemos el src
    if (value.includes("<iframe")) {
      const match = value.match(/src=["']([^"']+)["']/i);
      if (match && match[1]) {
        finalUrl = match[1];
      }
    }

    // Validamos que sea un enlace legítimo de Google Maps Embed
    const isGoogleMaps = finalUrl.includes("google.com/maps/embed") || finalUrl.includes("google.com/maps/vt");
    
    if (finalUrl && !isGoogleMaps) {
      // Si hay algo pero no es Google Maps, lo ignoramos para seguridad
      return "";
    }

    return finalUrl;
  };

  // Sync state correctly when component loads
  useEffect(() => {
    setForm({
      ...contacto,
      mapaEmbed: extractSrc(contacto.mapaEmbed)
    });
  }, [contacto]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setContacto(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddTick = () => {
    setForm(prev => ({
      ...prev,
      sobre_nosotros_ticks: [...(prev.sobre_nosotros_ticks || []), ""]
    }));
  };

  const handleUpdateTick = (index: number, value: string) => {
    const newTicks = [...(form.sobre_nosotros_ticks || [])];
    newTicks[index] = value;
    setForm({ ...form, sobre_nosotros_ticks: newTicks });
  };

  const handleRemoveTick = (index: number) => {
    const newTicks = [...(form.sobre_nosotros_ticks || [])];
    newTicks.splice(index, 1);
    setForm({ ...form, sobre_nosotros_ticks: newTicks });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const url = await uploadImage(file, "general");
      if (url) {
        // Option to delete the previous image if desired:
        // if (form.sobre_nosotros_imagen) await deleteImageFromStorage(form.sobre_nosotros_imagen);
        setForm(prev => ({ ...prev, sobre_nosotros_imagen: url }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const hasChanges = JSON.stringify(form) !== JSON.stringify({
    ...contacto,
    mapaEmbed: extractSrc(contacto.mapaEmbed)
  });

  return (
    <div className="animate-fade-in max-w-5xl">
      <PageHeader
        icon={Phone}
        title="Opciones de Contacto"
        description="Administra los datos de ubicación, redes y mapa del sitio."
        action={
          <button
            onClick={handleSave}
            disabled={( !hasChanges && !saved ) || saving}
            className={`flex items-center gap-2 py-2 px-6 rounded-lg font-semibold text-sm transition-all duration-300 ${
              saved 
                ? "bg-emerald-500 text-emerald-950" 
                : saving
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : hasChanges 
                    ? "bg-[hsl(175_80%_50%)] text-[hsl(220_20%_6%)] shadow-[0_0_20px_hsl(175_80%_50%_/_0.3)]" 
                    : "bg-[hsl(220_15%_18%)] text-[hsl(215_15%_45%)] cursor-not-allowed"
            }`}
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Guardando...</span>
              </>
            ) : saved ? (
              <>
                <Phone size={16} className="hidden" /> {/* Keep layout stable if needed, though simple icon change is fine */}
                <span>¡Cambios Guardados!</span>
              </>
            ) : (
              <>
                <Save size={16} /> 
                <span>Guardar Cambios</span>
              </>
            )}
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

              <div className="pt-2 border-t" style={{ borderColor: "hsl(220 15% 18%)" }}>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2 mt-4" style={{ color: "hsl(215 15% 55%)" }}>
                  Enlace de Facebook
                </label>
                <input
                  className="input-field mb-4"
                  value={form.facebook || ""}
                  onChange={(e) => setForm({ ...form, facebook: e.target.value })}
                  placeholder="https://facebook.com/..."
                />
                
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "hsl(215 15% 55%)" }}>
                  Enlace de Instagram
                </label>
                <input
                  className="input-field"
                  value={form.instagram || ""}
                  onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                  placeholder="https://instagram.com/..."
                />
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
                  4. Copia y pega el código <strong>&lt;iframe...&gt;</strong> completo aquí.
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

      <div className="mt-6 rounded-xl border p-6" style={{ background: "hsl(220 18% 10%)", borderColor: "hsl(220 15% 18%)" }}>
        <h3 className="mb-6 font-bold text-lg flex items-center gap-2" style={{ color: "hsl(210 20% 92%)" }}>
          Sobre Nosotros
        </h3>
        
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "hsl(215 15% 55%)" }}>
                Texto Principal
              </label>
              <textarea
                className="input-field h-40 pt-3"
                value={form.sobre_nosotros_texto || ""}
                onChange={(e) => setForm({ ...form, sobre_nosotros_texto: e.target.value })}
                placeholder="Escribe aquí la historia de Game Doctor..."
              />
              <p className="mt-2 text-[10px]" style={{ color: "hsl(215 15% 45%)" }}>Puedes usar enter y crear saltos de linea.</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(215 15% 55%)" }}>
                  Características (Ticks)
                </label>
                <button
                  type="button"
                  onClick={handleAddTick}
                  className="flex items-center gap-1 text-xs px-2 py-1 bg-primary/20 text-primary rounded border border-primary/30 hover:bg-primary/30 transition"
                >
                  <Plus size={14} /> Añadir
                </button>
              </div>
              <div className="space-y-2">
                {(form.sobre_nosotros_ticks || []).map((tick, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      className="input-field"
                      value={tick}
                      onChange={(e) => handleUpdateTick(i, e.target.value)}
                      placeholder={`Característica ${i + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveTick(i)}
                      className="p-3 text-red-400 bg-red-400/10 hover:bg-red-400/20 rounded-md transition border border-red-400/20"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {(!form.sobre_nosotros_ticks || form.sobre_nosotros_ticks.length === 0) && (
                  <p className="text-xs italic text-muted-foreground">No hay ticks añadidos.</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "hsl(215 15% 55%)" }}>
                Imagen Personalizada (Opcional)
              </label>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
              
              {form.sobre_nosotros_imagen ? (
                <div className="relative group">
                  <img 
                    src={form.sobre_nosotros_imagen} 
                    alt="Sobre Nosotros preview" 
                    className="w-full max-w-[320px] aspect-square object-cover rounded-xl border border-primary/30 box-glow"
                  />
                  <div className="absolute inset-0 max-w-[320px] bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl backdrop-blur-sm gap-4">
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-primary/20 text-primary border border-primary p-3 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors shadow-lg"
                      title="Cambiar imagen"
                    >
                      <ImagePlus size={24} />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setForm(prev => ({ ...prev, sobre_nosotros_imagen: "" }))}
                      className="bg-red-500/20 text-red-400 border border-red-500 p-3 rounded-full hover:bg-red-500 hover:text-white transition-colors shadow-lg"
                      title="Quitar imagen"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="w-full max-w-[320px] aspect-square rounded-xl border border-dashed flex flex-col items-center justify-center gap-4 transition-all hover:border-primary hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed group"
                  style={{ borderColor: 'hsl(220 15% 22%)', color: 'hsl(215 15% 55%)' }}
                >
                  {uploadingImage ? (
                    <>
                      <Loader2 className="animate-spin text-primary" size={32} />
                      <span className="text-sm font-medium">Subiendo imagen...</span>
                    </>
                  ) : (
                    <>
                      <div className="p-4 rounded-full bg-[hsl(220_15%_14%)] group-hover:bg-primary/10 transition-colors">
                        <ImagePlus size={32} className="group-hover:text-primary transition-colors" />
                      </div>
                      <div className="text-center">
                        <p className="font-semibold" style={{ color: "hsl(210 20% 92%)" }}>Click para subir imagen</p>
                        <p className="text-xs mt-1">PNG, JPG, WEBP (Recomendado 1:1)</p>
                        <p className="text-[10px] mt-2 italic">Si no hay imagen, se mostrará el logo &quot;GD&quot;.</p>
                      </div>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
