import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { GraduationCap, Heart, Leaf, Store, ArrowRight, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

// Mapping Icon
const iconMap: Record<string, any> = {
  pendidikan: GraduationCap,
  kesehatan: Heart,
  umkm: Store,
  lingkungan: Leaf,
  default: HelpCircle,
};

// Tipe data untuk Program
interface ProgramData {
  id: string;
  title: string;
  description: string;
  raised: number;
  target: number;
  donors: number;
  category: string;
}

const ProgramsSection = () => {
  const [programList, setProgramList] = useState<ProgramData[]>([]);
  const location = useLocation();

  // Format Rupiah
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

  useEffect(() => {
    // 1. Ambil data awal
    const fetchPrograms = async () => {
      const { data, error } = await (supabase as any)
        .from("programs")
        .select("*")
        .order("id", { ascending: true });

      if (data) {
        setProgramList(data as ProgramData[]);
      } else if (error) {
        console.error("Error fetching programs:", error);
      }
    };

    fetchPrograms();

    // 2. Aktifkan Realtime Listener
    const channel = supabase
      .channel("programs-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "programs" },
        () => {
          fetchPrograms();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (location.hash === "#programs") {
      const el = document.getElementById("programs");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location]);

  return (
    <section id="programs" className="py-20 lg:py-28 bg-secondary/30">
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

        {/* Grid Program Dinamis */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programList.map((program, index) => {
            const IconComponent = iconMap[program.category] || iconMap.default;

            return (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-border/50 group"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-105 transition-all duration-300">
                  <IconComponent className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>

                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                  {program.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {program.description}
                </p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-foreground font-medium">
                      {formatCurrency(program.raised)}
                    </span>
                    <span className="text-muted-foreground">
                      dari {formatCurrency(program.target)}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full progress-bar-animated"
                      initial={{ width: 0 }}
                      whileInView={{
                        width: `${calculateProgress(program.raised, program.target)}%`,
                      }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {program.donors} Donatur
                  </span>
                  {/* UPDATE LINK DI SINI: Menyertakan ID Program */}
                  <Link to={`/donasi?program_id=${program.id}`}>
                    <Button variant="ghost" size="sm" className="group/btn">
                      Donasi
                      <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Removed "Lihat Semua Program" button as requested */}
      </div>
    </section>
  );
};

export default ProgramsSection;