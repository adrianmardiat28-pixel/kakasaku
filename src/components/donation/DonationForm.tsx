import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import { Heart, CreditCard, Building2, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const nominalOptions = [
  { value: 50000, label: "Rp 50.000" },
  { value: 100000, label: "Rp 100.000" },
  { value: 250000, label: "Rp 250.000" },
  { value: 500000, label: "Rp 500.000" },
  { value: 1000000, label: "Rp 1.000.000" },
];

const paymentMethods = [
  { id: "bank", label: "Transfer Bank", icon: Building2 },
  { id: "card", label: "Kartu Kredit", icon: CreditCard },
  { id: "ewallet", label: "E-Wallet", icon: Wallet },
];

interface DonationFormProps {
  onSuccess?: () => void;
}

const DonationForm = ({ onSuccess }: DonationFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedNominal, setSelectedNominal] = useState<number | null>(null);
  const [customNominal, setCustomNominal] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = selectedNominal || parseInt(customNominal);
    
    if (!name || !email || !amount || !paymentMethod) {
      toast({
        title: "Form tidak lengkap",
        description: "Mohon lengkapi semua data yang diperlukan.",
        variant: "destructive",
      });
      return;
    }

    if (amount < 10000) {
      toast({
        title: "Nominal terlalu kecil",
        description: "Minimal donasi adalah Rp 10.000",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("donations").insert({
        name,
        email,
        amount,
        payment_method: paymentMethod,
        type: "umum",
        status: "completed",
      });

      if (error) throw error;

      toast({
        title: "Donasi Berhasil! 🎉",
        description: "Terima kasih atas kebaikan Anda. Detail pembayaran akan dikirim ke email Anda.",
      });

      // Reset form
      setName("");
      setEmail("");
      setSelectedNominal(null);
      setCustomNominal("");
      setPaymentMethod("");
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error submitting donation:", error);
      toast({
        title: "Terjadi Kesalahan",
        description: "Mohon coba lagi nanti.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="bg-card rounded-2xl p-6 lg:p-8 shadow-sm border border-border/50"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Heart className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="font-serif text-xl font-bold text-foreground">Form Donasi</h2>
          <p className="text-sm text-muted-foreground">Isi data Anda untuk berdonasi</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Nama Lengkap</Label>
          <Input
            id="name"
            placeholder="Masukkan nama Anda"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Nominal */}
        <div className="space-y-3">
          <Label>Pilih Nominal Donasi</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {nominalOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setSelectedNominal(option.value);
                  setCustomNominal("");
                }}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  selectedNominal === option.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="custom">Atau masukkan nominal lain</Label>
            <Input
              id="custom"
              type="number"
              placeholder="Rp"
              value={customNominal}
              onChange={(e) => {
                setCustomNominal(e.target.value);
                setSelectedNominal(null);
              }}
              min={10000}
            />
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-3">
          <Label>Metode Pembayaran</Label>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="grid gap-2">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center">
                  <RadioGroupItem value={method.id} id={method.id} className="sr-only" />
                  <Label
                    htmlFor={method.id}
                    className={`flex items-center gap-3 w-full p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      paymentMethod === method.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <method.icon className={`w-5 h-5 ${paymentMethod === method.id ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={paymentMethod === method.id ? "text-primary font-medium" : ""}>
                      {method.label}
                    </span>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <Button
          type="submit"
          variant="hero"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            "Memproses..."
          ) : (
            <>
              <Heart className="w-5 h-5 mr-2" />
              Donasi Sekarang
            </>
          )}
        </Button>
      </div>
    </motion.form>
  );
};

export default DonationForm;
