import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  jsonLd?: object;
}

/**
 * @SEO Componente reutilizable para inyectar metadata dinámica por ruta.
 * Cada página debe tener un <SEOHead> con título y descripción únicos.
 */
const SEOHead = ({ title, description, canonical, ogImage, jsonLd }: SEOHeadProps) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    {ogImage && <meta property="og:image" content={ogImage} />}
    {canonical && <link rel="canonical" href={canonical} />}
    {jsonLd && (
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    )}
  </Helmet>
);

export default SEOHead;
