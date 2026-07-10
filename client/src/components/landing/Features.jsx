import { Quote, Zap, FolderOpen, Lock, Combine } from "lucide-react";
import { motion } from "framer-motion";

const supporting = [
  {
    icon: Zap,
    title: "Instant summaries",
    description: "Key points the moment a document finishes processing.",
  },
  {
    icon: Combine,
    title: "Chat with one doc or all",
    description: "Cross-reference your whole library in a single question.",
  },
  {
    icon: FolderOpen,
    title: "Folders, tags & pins",
    description: "Keep a growing library easy to navigate.",
  },
  {
    icon: Lock,
    title: "Private by default",
    description: "Your documents are never used to train models.",
  },
];

export default function Features() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-balance text-center mb-10">
          Built for real work
        </h2>

        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4 }}
            className="card-minimal flex flex-col justify-center gap-4 p-8"
          >
            <Quote className="w-8 h-8 text-primary" />
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">
                Cited answers, not guesses
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Every answer links straight back to the exact page it came from.
                Click a citation, see the source instantly — no hallucinated sources.
              </p>
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {supporting.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.4, delay: idx * 0.06 }}
                  className="card-minimal space-y-2"
                >
                  <Icon className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground text-sm">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
