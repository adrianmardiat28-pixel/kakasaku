import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import ProgramsSection from "@/components/home/ProgramsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Kakasaku Jakarta Mengabdi - Platform Donasi Terpercaya</title>
        <meta 
          name="description" 
          content="Platform donasi umum dan donasi rutin bulanan untuk membangun Jakarta yang lebih baik. Bergabunglah dengan ribuan donatur yang telah berkontribusi." 
        />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <HeroSection />
          <ProgramsSection />
          <TestimonialsSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
