import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DonationForm from "@/components/donation/DonationForm";
import DonationProgress from "@/components/donation/DonationProgress";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Shield, Clock, Heart } from "lucide-react";

const DonasiPage = () => {
  const features = [
    {
      icon: Shield,
      title: "100% Aman",
      description: "Transaksi Anda dijamin aman dengan enkripsi SSL",
    },
    {
      icon: Clock,
      title: "Cepat & Mudah",
      description: "Proses donasi hanya membutuhkan beberapa menit",
    },
    {
      icon: Heart,
      title: "Transparan",
      description: "Laporan penggunaan dana tersedia untuk publik",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Donasi Sekarang - Kakasaku Jakarta Mengabdi</title>
        <meta 
          name="description" 
          content="Berdonasi untuk program-program sosial di Jakarta. Donasi Anda akan digunakan untuk pendidikan, kesehatan, dan pemberdayaan masyarakat." 
        />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 lg:px-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                Donasi Umum
              </span>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Berbagi Kebaikan
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Setiap rupiah yang Anda donasikan akan membantu mereka yang membutuhkan. Bersama kita bisa membuat perbedaan.
              </p>
            </motion.div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
              {/* Left - Progress */}
              <div className="space-y-6">
                <DonationProgress />
                
                {/* Features */}
                <div className="grid gap-4">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="flex items-start gap-4 bg-card rounded-xl p-4 border border-border/50"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right - Form */}
              <DonationForm />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default DonasiPage;
