import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="Kakasaku" className="w-6 h-6 object-cover" />
              </div>
              <div>
                <span className="font-serif text-lg font-semibold">Kakasaku</span>
                <span className="block text-xs text-background/70 -mt-1">Jakarta Mengabdi</span>
              </div>
            </Link>
            <p className="text-background/70 text-sm leading-relaxed">
              Platform donasi terpercaya untuk membangun Jakarta yang lebih baik melalui kebaikan bersama.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-semibold mb-4">Navigasi</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-background/70 hover:text-background text-sm transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link to="/donasi" className="text-background/70 hover:text-background text-sm transition-colors">
                  Donasi Umum
                </Link>
              </li>
              <li>
                <Link to="/kakasaku" className="text-background/70 hover:text-background text-sm transition-colors">
                  Program Kakasaku
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-serif font-semibold mb-4">Program</h4>
            <ul className="space-y-2">
              <li className="text-background/70 text-sm">Donasi Pendidikan</li>
              <li className="text-background/70 text-sm">Bantuan Kesehatan</li>
              <li className="text-background/70 text-sm">Pemberdayaan UMKM</li>
              <li className="text-background/70 text-sm">Lingkungan Hidup</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif font-semibold mb-4">Kontak</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-background/70 text-sm">
                <Mail className="w-4 h-4" />
                info@kakasaku.id
              </li>
              <li className="flex items-center gap-2 text-background/70 text-sm">
                <Phone className="w-4 h-4" />
                +62 21 1234 5678
              </li>
              <li className="flex items-start gap-2 text-background/70 text-sm">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>Jakarta Pusat, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-background/50 text-sm">
            © 2024 Kakasaku Jakarta Mengabdi. Hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-1 text-background/50 text-sm">
          <img src="/logo.png" alt="Kakasaku" className="w-4 h-4 object-cover mx-1 rounded-sm" /> untuk Jakarta
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
