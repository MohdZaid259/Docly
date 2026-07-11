import { Check } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const tiers = [
  {
    name: "Free",
    price: "$0",
    current: true,
    features: ["Up to 5 documents", "50 questions/month", "Basic summaries"],
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
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
    name: "Team",
    price: "Custom",
    features: ["Everything in Pro", "Team collaboration", "Advanced permissions", "SSO & SAML"],
  },
];

const BillingPage = () => {
  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">Billing</h1>
          <p className="mt-1 text-sm text-muted-foreground">You're currently on the Free plan.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {tiers.map((tier) => (
            <Card key={tier.name} className="flex flex-col gap-5 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">{tier.name}</h3>
                {tier.current && <Badge variant="success">Current plan</Badge>}
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">{tier.price}</span>
                {tier.period && <span className="text-sm text-muted-foreground">{tier.period}</span>}
              </div>

              <Button variant={tier.current ? "secondary" : "outline"} disabled>
                {tier.current ? "Current plan" : "Coming soon"}
              </Button>

              <ul className="flex-1 space-y-2.5 text-sm">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-muted-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
