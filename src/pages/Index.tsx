import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import ShopTabs from "@/components/ShopTabs";
import CompraConsolasSection from "@/components/CompraConsolasSection";
import AboutSection from "@/components/AboutSection";
import ReviewsSection from "@/components/ReviewsSection";
import FacebookSection from "@/components/FacebookSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEOHead from "@/components/SEOHead";

import { useContacto } from "../admin/store";

const Index = () => {
  const [contacto] = useContacto();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "name": "Game Doctor",
        "description": contacto.sobre_nosotros_texto || "Reparación y venta de consolas en Montevideo.",
        "url": "https://gamedoctor.uy",
        "telephone": contacto.telefono,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": contacto.direccion.split(",")[0],
          "addressLocality": "Montevideo",
          "addressRegion": "La Unión",
          "addressCountry": "UY"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": -34.8576,
          "longitude": -56.1452
        },
        "priceRange": "$$",
        "image": "https://gamedoctor.uy/assets/hero-bg.jpg"
      },
      {
        "@type": "Service",
        "name": "Reparación de consolas",
        "description": "Servicio técnico profesional para PlayStation, Xbox y Nintendo. Garantía en cada trabajo.",
        "provider": {
          "@type": "LocalBusiness",
          "name": "Game Doctor"
        },
        "areaServed": {
          "@type": "City",
          "name": "Montevideo"
        },
        "serviceType": "Reparación de consolas de videojuegos"
      }
    ]
  };

  return (
    <>
      <SEOHead
        title="Game Doctor — Reparación y Venta de Consolas en Montevideo, Uruguay"
        description="Reparación profesional de consolas PlayStation, Xbox y Nintendo en La Unión, Montevideo. Venta de consolas nuevas y restauradas, juegos digitales y Game Pass al mejor precio de Uruguay."
        canonical="https://gamedoctor.uy/"
        ogImage="https://gamedoctor.uy/og-image.jpg"
        jsonLd={jsonLd}
      />
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <ShopTabs />
      <CompraConsolasSection />
      <AboutSection />
      <ReviewsSection />
      <FacebookSection />
      <ContactSection />
      <Footer />
      <WhatsAppButton floating />
    </>
  );
};

export default Index;
