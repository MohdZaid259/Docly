import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function FAQ() {
  const [expanded, setExpanded] = useState(0);

  const faqs = [
    {
      question: "What file types do you support?",
      answer: "PDF, DOCX, and plain text (.txt) files today.",
    },
    {
      question: "Is my data private?",
      answer: "Yes. Your documents are never used to train our models. Encrypted in transit and at rest.",
    },
    {
      question: "What LLM powers the answers?",
      answer: "Docly uses OpenAI's models for chat and embeddings, accessed through a managed gateway.",
    },
    {
      question: "How accurate are the citations?",
      answer: "Citations link back to the exact source passage retrieved for your answer, so you can verify it yourself in one click.",
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes, no contracts or fees. Cancel from your account settings whenever you want.",
    },
    {
      question: "Do you support scanned/image-only PDFs?",
      answer: "Not yet — Docly currently reads text-based PDFs. OCR support for scanned documents is on the roadmap.",
    },
  ];

  return (
    <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-balance text-center mb-10">
          Common <span className="text-primary">questions</span>
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <motion.button
              key={idx}
              type="button"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              onClick={() => setExpanded(expanded === idx ? null : idx)}
              aria-expanded={expanded === idx}
              className="w-full card-minimal text-left transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-base font-semibold text-foreground">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-primary shrink-0 transition-transform duration-300 ${
                    expanded === idx ? "rotate-180" : ""
                  }`}
                />
              </div>

              {expanded === idx && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
