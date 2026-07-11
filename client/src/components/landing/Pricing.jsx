import { Check, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Pricing() {
  const tiers = [
    {
      name: "Pro",
      price: "$29",
      period: "/month",
      cta: "Coming Soon",
      comingSoon: true,
      features: [
        "Unlimited documents",
        "Unlimited questions",
        "Advanced summaries",
        "Cross-document search",
        "Export & sharing",
        "Priority support",
      ],
    },
    {
      name: "Free",
      price: "$0",
      cta: "Get Started",
      ctaVariant: "primary",
      popular: true,
      features: [
        "Up to 10 documents",
        "100 questions/month",
        "AI summaries with source citations",
      ],
      extra: "No limits for new users (first 5 days)",
    },
    {
      name: "Team",
      price: "Custom",
      cta: "Contact sales",
      ctaVariant: "secondary",
      comingSoon: true,
      features: [
        "Everything in Pro",
        "Team collaboration",
        "Advanced permissions",
        "SSO & SAML",
        "Dedicated support",
      ],
    },
  ];

  return (
    <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-balance">
            Simple <span className="text-primary">pricing</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className={`relative card-minimal space-y-6 h-full flex flex-col ${
                tier.popular ? "md:ring-2 md:ring-primary" : ""
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-4">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                    Available now
                  </span>
                </div>
              )}

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">
                  {tier.name}
                </h3>
              </div>

              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-foreground">
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-muted-foreground text-sm">
                      {tier.period}
                    </span>
                  )}
                </div>
              </div>

              <div>
                {tier.comingSoon ? (
                  <button
                    type="button"
                    disabled
                    className="btn-secondary w-full opacity-50 cursor-not-allowed"
                  >
                    {tier.cta}
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className={`w-full block text-center ${
                      tier.ctaVariant === "primary" ? "btn-primary" : "btn-secondary"
                    }`}
                  >
                    {tier.cta}
                  </Link>
                )}
              </div>

              {tier.comingSoon && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Lock className="w-3 h-3" />
                  <span>Coming soon</span>
                </div>
              )}

              <div className="space-y-3 flex-1">
                {tier.features.map((feature, fidx) => (
                  <div key={fidx} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground text-sm">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <div>
                {tier.extra && (
                  <p className="text-xs text-primary text-center">
                    {tier.extra}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
