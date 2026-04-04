import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
}

/**
 * @SEO Componente reutilizable para inyectar metadata dinámica por ruta.
 * Cada página debe tener un <SEOHead> con título y descripción únicos.
 */
const SEOHead = ({ title, description, canonical }: SEOHeadProps) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    {canonical && <link rel="canonical" href={canonical} />}
  </Helmet>
);

export default SEOHead;
