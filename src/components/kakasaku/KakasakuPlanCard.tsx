import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface KakasakuPlanCardProps {
  amount: number;
  isPopular?: boolean;
  features: string[];
  onSelect: (amount: number) => void;
}

const KakasakuPlanCard = ({ amount, isPopular, features, onSelect }: KakasakuPlanCardProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className={`relative bg-card rounded-2xl p-6 lg:p-8 border-2 transition-all ${
        isPopular ? "border-primary shadow-lg" : "border-border/50 shadow-sm"
      }`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
            Paling Populer
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <p className="text-muted-foreground text-sm mb-2">Donasi Bulanan</p>
        <p className="font-serif text-3xl font-bold text-foreground">
          {formatCurrency(amount)}
        </p>
        <p className="text-muted-foreground text-sm">/bulan</p>
      </div>

      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-primary" />
            </div>
            <span className="text-sm text-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        variant={isPopular ? "hero" : "outline"}
        size="lg"
        className="w-full"
        onClick={() => onSelect(amount)}
      >
        Pilih Paket Ini
      </Button>
    </motion.div>
  );
};

export default KakasakuPlanCard;
