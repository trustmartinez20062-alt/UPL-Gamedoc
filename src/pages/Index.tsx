import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import ConsolasSection from "@/components/ConsolasSection";
import JuegosSection from "@/components/JuegosSection";
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
    <ConsolasSection />
    <JuegosSection />
    <AboutSection />
    <ReviewsSection />
    <FacebookSection />
    <ContactSection />
    <Footer />
    <WhatsAppButton floating />
  </>
);

export default Index;
