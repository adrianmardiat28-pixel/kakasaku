import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import KakasakuPlanCard from "@/components/kakasaku/KakasakuPlanCard";
import KakasakuForm from "@/components/kakasaku/KakasakuForm";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Users, Calendar, Award, CheckCircle } from "lucide-react";

const plans = [
  {
    amount: 50000,
    features: [
      "Donasi rutin setiap bulan",
      "Laporan dampak donasi",
      "Sertifikat donatur digital",
      "Update program via email",
    ],
  },
  {
    amount: 100000,
    isPopular: true,
    features: [
      "Semua benefit paket 50k",
      "Prioritas info program baru",
      "Akses komunitas Kakasaku",
      "Badge donatur di website",
    ],
  },
  {
    amount: 250000,
    features: [
      "Semua benefit paket 100k",
      "Undangan acara eksklusif",
      "Laporan dampak personal",
      "Nama di Wall of Fame",
    ],
  },
];

const benefits = [
  {
    icon: Users,
    title: "Komunitas",
    description: "Bergabung dengan komunitas donatur yang peduli",
  },
  {
    icon: Calendar,
    title: "Rutin & Teratur",
    description: "Donasi otomatis setiap bulan tanpa ribet",
  },
  {
    icon: Award,
    title: "Dampak Nyata",
    description: "Laporan penggunaan dana yang transparan",
  },
];

const KakasakuPage = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSelectPlan = (amount: number) => {
    setSelectedAmount(amount);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedAmount(null);
  };

  return (
    <>
      <Helmet>
        <title>Kakasaku - Program Donasi Rutin Bulanan</title>
        <meta 
          name="description" 
          content="Bergabung dengan Kakasaku, program donasi rutin bulanan. Donasi nominal tetap setiap bulan untuk dampak yang berkelanjutan." 
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
                Donasi Rutin Bulanan
              </span>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Program Kakasaku
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Jadilah pahlawan setiap bulan. Dengan donasi rutin, Anda memberikan dampak berkelanjutan bagi mereka yang membutuhkan.
              </p>
            </motion.div>

            {/* Benefits */}
            <div className="grid md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Plans */}
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto mb-12">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.amount}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <KakasakuPlanCard
                    amount={plan.amount}
                    isPopular={plan.isPopular}
                    features={plan.features}
                    onSelect={handleSelectPlan}
                  />
                </motion.div>
              ))}
            </div>

            {/* Custom Amount Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <p className="text-muted-foreground">
                Ingin nominal lain?{" "}
                <button
                  onClick={() => handleSelectPlan(0)}
                  className="text-primary font-medium hover:underline"
                >
                  Hubungi kami
                </button>{" "}
                untuk nominal custom.
              </p>
            </motion.div>

            {/* How It Works */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-20 max-w-4xl mx-auto"
            >
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
                Cara Bergabung Kakasaku
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { step: 1, title: "Pilih Paket", desc: "Pilih nominal donasi bulanan" },
                  { step: 2, title: "Daftar", desc: "Isi data diri Anda" },
                  { step: 3, title: "Pembayaran", desc: "Bayar donasi pertama" },
                  { step: 4, title: "Selesai!", desc: "Donasi rutin aktif" },
                ].map((item, index) => (
                  <div key={item.step} className="text-center relative">
                    {index < 3 && (
                      <div className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 bg-border" />
                    )}
                    <div className="relative z-10 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-3 font-bold">
                      {item.step}
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />

        {/* Registration Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm"
              onClick={handleCloseForm}
            >
              <div onClick={(e) => e.stopPropagation()}>
                <KakasakuForm
                  selectedAmount={selectedAmount}
                  onClose={handleCloseForm}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default KakasakuPage;
