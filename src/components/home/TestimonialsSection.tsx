import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Budi Santoso",
    role: "Donatur Tetap Kakasaku",
    content: "Sangat mudah untuk berdonasi dan saya bisa melihat langsung dampak dari kontribusi saya. Platform yang sangat transparan!",
    rating: 5,
  },
  {
    name: "Siti Rahayu",
    role: "Donatur Program Pendidikan",
    content: "Kakasaku Jakarta Mengabdi membantu saya menyalurkan donasi dengan mudah dan aman. Tim mereka sangat responsif.",
    rating: 5,
  },
  {
    name: "Ahmad Wijaya",
    role: "Anggota Kakasaku",
    content: "Dengan donasi rutin bulanan, saya merasa lebih teratur dalam berbagi. Sistem pembayarannya sangat praktis.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Testimoni
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Kata Mereka Tentang Kami
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Bergabunglah dengan ribuan donatur yang telah mempercayakan kontribusinya kepada kami.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl p-6 lg:p-8 shadow-sm border border-border/50 relative"
            >
              <Quote className="w-10 h-10 text-primary/20 absolute top-6 right-6" />
              
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-warning fill-warning" />
                ))}
              </div>

              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
