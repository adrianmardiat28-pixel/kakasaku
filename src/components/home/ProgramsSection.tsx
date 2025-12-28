import { motion } from "framer-motion";
import { GraduationCap, Heart, Leaf, Store, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const programs = [
  {
    icon: GraduationCap,
    title: "Pendidikan Anak Bangsa",
    description: "Bantu anak-anak kurang mampu mendapatkan akses pendidikan yang layak dan berkualitas.",
    raised: 25000000,
    target: 50000000,
    donors: 128,
  },
  {
    icon: Heart,
    title: "Bantuan Kesehatan",
    description: "Dukung biaya pengobatan untuk masyarakat yang membutuhkan bantuan medis.",
    raised: 32000000,
    target: 75000000,
    donors: 256,
  },
  {
    icon: Store,
    title: "Pemberdayaan UMKM",
    description: "Bantu pengusaha kecil mengembangkan usaha mereka dengan modal dan pelatihan.",
    raised: 18000000,
    target: 40000000,
    donors: 89,
  },
  {
    icon: Leaf,
    title: "Jakarta Hijau",
    description: "Bersama kita hijaukan Jakarta dengan program penanaman pohon dan taman kota.",
    raised: 12000000,
    target: 30000000,
    donors: 156,
  },
];

const ProgramsSection = () => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateProgress = (raised: number, target: number) => {
    return Math.min((raised / target) * 100, 100);
  };

  return (
    <section className="py-20 lg:py-28 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Program Kami
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Program Donasi Aktif
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Pilih program yang ingin Anda dukung dan jadilah bagian dari perubahan positif di Jakarta.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((program, index) => (
            <motion.div
              key={program.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-border/50 group"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-105 transition-all duration-300">
                <program.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>

              <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                {program.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {program.description}
              </p>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-foreground font-medium">{formatCurrency(program.raised)}</span>
                  <span className="text-muted-foreground">dari {formatCurrency(program.target)}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full progress-bar-animated"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${calculateProgress(program.raised, program.target)}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {program.donors} Donatur
                </span>
                <Link to="/donasi">
                  <Button variant="ghost" size="sm" className="group/btn">
                    Donasi
                    <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/donasi">
            <Button variant="outline" size="lg">
              Lihat Semua Program
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ProgramsSection;
