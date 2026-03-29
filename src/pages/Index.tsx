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

const Index = () => (
  <>
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
