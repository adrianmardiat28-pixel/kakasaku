import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Users, Calendar, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface KakasakuFormProps {
  selectedAmount: number | null;
  onClose?: () => void;
}

const KakasakuForm = ({ selectedAmount, onClose }: KakasakuFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phone || !selectedAmount) {
      toast({
        title: "Form tidak lengkap",
        description: "Mohon lengkapi semua data yang diperlukan.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("kakasaku_members").insert({
        name,
        email,
        phone,
        monthly_amount: selectedAmount,
        payment_status: "belum",
      });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Email Sudah Terdaftar",
            description: "Email ini sudah terdaftar sebagai anggota Kakasaku.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "Pendaftaran Berhasil! 🎉",
        description: "Selamat bergabung dengan Kakasaku. Informasi pembayaran akan dikirim ke email Anda.",
      });

      if (onClose) onClose();
    } catch (error) {
      console.error("Error registering member:", error);
      toast({
        title: "Terjadi Kesalahan",
        description: "Mohon coba lagi nanti.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedAmount) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-card rounded-2xl p-6 lg:p-8 shadow-lg border border-border/50 max-w-md mx-auto"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Users className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="font-serif text-xl font-bold text-foreground">Gabung Kakasaku</h2>
          <p className="text-sm text-muted-foreground">
            Donasi {formatCurrency(selectedAmount)}/bulan
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-primary/5 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CreditCard className="w-4 h-4" />
            <span>Donasi Bulanan</span>
          </div>
          <span className="font-semibold text-foreground">
            {formatCurrency(selectedAmount)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Jatuh Tempo</span>
          </div>
          <span className="text-sm text-foreground">
            Tanggal 1 setiap bulan
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="kakasaku-name">Nama Lengkap</Label>
          <Input
            id="kakasaku-name"
            placeholder="Masukkan nama Anda"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="kakasaku-email">Email</Label>
          <Input
            id="kakasaku-email"
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="kakasaku-phone">Nomor Telepon</Label>
          <Input
            id="kakasaku-phone"
            type="tel"
            placeholder="08xx xxxx xxxx"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="hero"
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Memproses..." : "Daftar Sekarang"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default KakasakuForm;
