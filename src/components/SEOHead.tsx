import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string; // Path relativo (ex: "/consolas")
  ogImage?: string;   // Path relativo (ex: "/og-image.jpg")
  jsonLd?: object;
}

/**
 * @SEO Componente reutilizable para inyectar metadata dinámica por ruta.
 * Maneja el dominio base automáticamente desde las variables de entorno.
 */
const SEOHead = ({ title, description, canonical, ogImage, jsonLd }: SEOHeadProps) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || "https://gamedoctor.uy";
  
  // Limpiar slash inicial si existe y concatenar
  const fullCanonical = canonical ? `${siteUrl}${canonical.startsWith("/") ? "" : "/"}${canonical}` : undefined;
  const fullOgImage = ogImage ? `${siteUrl}${ogImage.startsWith("/") ? "" : "/"}${ogImage}` : undefined;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {fullOgImage && <meta property="og:image" content={fullOgImage} />}
      {fullCanonical && <link rel="canonical" href={fullCanonical} />}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
