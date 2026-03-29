import AboutSection from "./AboutSection";
import FacebookSection from "./FacebookSection";
import { motion } from "framer-motion";

const AboutAndNews = () => {
  return (
    <div className="bg-background">
      <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border overflow-hidden rounded-3xl border border-border mx-4 lg:mx-auto max-w-7xl mb-24">
        {/* We simplify the internal sections to fit side by side */}
        <div className="p-8 sm:p-12 lg:p-16 gradient-dark">
          <AboutSection isCompact={true} />
        </div>
        <div className="p-8 sm:p-12 lg:p-16 bg-card/10">
          <FacebookSection isCompact={true} />
        </div>
      </div>
    </div>
  );
};

export default AboutAndNews;
