import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto card-minimal text-center space-y-5 p-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-balance">
          Ready to work smarter with your documents?
        </h2>

        <Link to="/login" className="inline-flex items-center gap-2 btn-primary">
          Get started free
          <ArrowRight className="w-4 h-4" />
        </Link>

        <p className="text-sm text-muted-foreground">
          No credit card required.
        </p>
      </motion.div>
    </section>
  );
}
