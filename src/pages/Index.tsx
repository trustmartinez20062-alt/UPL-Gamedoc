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

const Index = () => (
  <>
    {/* @SEO Metadata dinámica para la página principal — prioriza reparación + Montevideo */}
    <SEOHead
      title="Game Doctor — Reparación y Venta de Consolas en Montevideo, Uruguay"
      description="Reparación profesional de consolas PlayStation, Xbox y Nintendo en La Unión, Montevideo. Venta de consolas nuevas y restauradas, juegos digitales y Game Pass al mejor precio de Uruguay."
      canonical="https://gamedoctor.uy/"
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

export default Index;
