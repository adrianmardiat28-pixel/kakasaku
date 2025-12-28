import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom"; // Penting: Import ini
import { motion } from "framer-motion";
import { Users, Target, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DonationProgressProps {
  onDataLoad?: (data: { raised: number; target: number; donors: number }) => void;
}

const DonationProgress = ({ onDataLoad }: DonationProgressProps) => {
  // 1. Ambil ID Program dari URL
  const [searchParams] = useSearchParams();
  const programId = searchParams.get("program_id");

  const [raised, setRaised] = useState(0);
  const [donors, setDonors] = useState(0);
  const [target, setTarget] = useState(50000000); // Default target umum

  // Hitung persentase (cegah error pembagian nol)
  const progress = target > 0 ? Math.min((raised / target) * 100, 100) : 0;

  useEffect(() => {
    const fetchData = async () => {
      if (programId) {
        // === SKENARIO A: PROGRAM SPESIFIK ===
        // Ambil data dari tabel 'programs' berdasarkan ID
        const { data } = await (supabase as any)
          .from("programs")
          .select("raised, target, donors")
          .eq("id", programId)
          .single();

        if (data) {
          setRaised(data.raised);
          setTarget(data.target);
          setDonors(data.donors);
          if (onDataLoad) onDataLoad({ raised: data.raised, target: data.target, donors: data.donors });
        }
      } else {
        // === SKENARIO B: DONASI UMUM ===
        // Hitung total dari semua donasi bertipe 'umum'
        const { data, error } = await supabase
          .from("donations")
          .select("amount")
          .eq("type", "umum");

        if (!error && data) {
          const total = data.reduce((sum, d) => sum + d.amount, 0);
          setRaised(total);
          setTarget(50000000); // Target Hardcoded untuk umum
          setDonors(data.length);
          if (onDataLoad) onDataLoad({ raised: total, target: 50000000, donors: data.length });
        }
      }
    };

    fetchData();

    // === REALTIME UPDATE ===
    const channel = supabase.channel("progress-realtime");

    if (programId) {
      // Jika di halaman Program, dengarkan tabel 'programs'
      channel
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "programs", filter: `id=eq.${programId}` },
          (payload: any) => {
            setRaised(payload.new.raised);
            setDonors(payload.new.donors);
            setTarget(payload.new.target);
          }
        )
        .subscribe();
    } else {
      // Jika di halaman Umum, dengarkan tabel 'donations'
      channel
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "donations" },
          () => fetchData()
        )
        .subscribe();
    }

    return () => {
      supabase.removeChannel(channel);
    };
  }, [programId]); // Effect jalan ulang jika ID di URL berubah

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-card rounded-2xl p-6 lg:p-8 shadow-sm border border-border/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Target className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-muted-foreground text-sm">
            {programId ? "Target Program Ini" : "Target Donasi Umum"}
          </p>
          <p className="font-serif text-xl font-bold text-foreground">
            {formatCurrency(target)}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">
            {progress.toFixed(1)}% tercapai
          </span>
          <span className="text-sm font-medium text-primary">
            {formatCurrency(raised)}
          </span>
        </div>
        <div className="h-4 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full progress-bar-animated"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted/50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs">Terkumpul</span>
          </div>
          <p className="font-serif text-lg font-bold text-foreground">
            {formatCurrency(raised)}
          </p>
        </div>
        <div className="bg-muted/50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Users className="w-4 h-4" />
            <span className="text-xs">Donatur</span>
          </div>
          <p className="font-serif text-lg font-bold text-foreground">
            {donors.toLocaleString("id-ID")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonationProgress;