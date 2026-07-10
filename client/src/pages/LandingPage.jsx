import Nav from "../components/landing/Nav";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import UseCases from "../components/landing/UseCases";
import Pricing from "../components/landing/Pricing";
import FAQ from "../components/landing/FAQ";
import CTASection from "../components/landing/CTASection";
import Footer from "../components/landing/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <Features />
      <UseCases />
      <Pricing />
      <FAQ />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;
