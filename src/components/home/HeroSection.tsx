import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Heart, Users, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const HeroSection = () => {
  const [totalDonations, setTotalDonations] = useState(0);
  const [totalDonors, setTotalDonors] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      // Fetch donations
      const { data: donations } = await supabase
        .from("donations")
        .select("amount");

      if (donations) {
        const total = donations.reduce((sum, d) => sum + d.amount, 0);
        setTotalDonations(total);
        setTotalDonors(donations.length);
      }

      // Fetch kakasaku members
      const { data: members } = await supabase
        .from("kakasaku_members")
        .select("monthly_amount");

      if (members) {
        const monthlyTotal = members.reduce((sum, m) => sum + m.monthly_amount, 0);
        setTotalDonations((prev) => prev + monthlyTotal);
        setTotalMembers(members.length);
      }
    };

    fetchStats();

    // Subscribe to realtime updates
    const donationsChannel = supabase
      .channel("hero-donations")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "donations" },
        () => fetchStats()
      )
      .subscribe();

    const membersChannel = supabase
      .channel("hero-members")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "kakasaku_members" },
        () => fetchStats()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(donationsChannel);
      supabase.removeChannel(membersChannel);
    };
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/30" />
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              Platform Donasi Terpercaya
            </span>
            
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Kakasaku
              <span className="block text-primary">Jakarta Mengabdi</span>
            </h1>
            
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              Platform donasi umum dan donasi rutin bulanan untuk membangun Jakarta yang lebih baik melalui kebaikan bersama.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link to="/donasi">
                <Button variant="hero" size="xl">
                  <Heart className="w-5 h-5 mr-2" />
                  Donasi Sekarang
                </Button>
              </Link>
              <Link to="/kakasaku">
                <Button variant="hero-outline" size="xl">
                  Gabung Kakasaku
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right Content - Stats Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div className="glass-card rounded-2xl p-6 warm-shadow">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <p className="text-muted-foreground text-sm mb-1">Total Donasi Terkumpul</p>
              <p className="font-serif text-2xl lg:text-3xl font-bold text-foreground">
                {formatCurrency(totalDonations)}
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 warm-shadow">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <p className="text-muted-foreground text-sm mb-1">Total Donatur</p>
              <p className="font-serif text-2xl lg:text-3xl font-bold text-foreground">
                {(totalDonors + totalMembers).toLocaleString("id-ID")}
              </p>
            </div>

            <div className="sm:col-span-2 glass-card rounded-2xl p-6 warm-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Anggota Kakasaku</p>
                  <p className="font-serif text-xl font-bold text-foreground">
                    {totalMembers} Anggota Aktif
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--secondary))"/>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
