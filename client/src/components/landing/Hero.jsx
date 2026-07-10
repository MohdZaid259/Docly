import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 border border-primary/30 rounded-full text-sm text-muted-foreground">
              Ask anything, get answers with sources
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-balance leading-tight">
              Answers from your documents, <span className="text-primary">with proof</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg">
              Upload a document, ask a question, get an answer with the exact page it came from — not a guess.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/login" className="btn-primary flex items-center justify-center gap-2">
                Start Free <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#how" className="btn-secondary flex items-center justify-center gap-2">
                See how it works
              </a>
            </div>

            <p className="text-sm text-muted-foreground">
              No credit card required.
            </p>
          </div>

          <div className="card-minimal space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Annual Report Q&A</h3>
              <div className="w-2 h-2 bg-primary rounded-full"></div>
            </div>

            <div className="space-y-4 h-80">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 shrink-0 flex items-center justify-center text-primary text-sm font-bold">
                  D
                </div>
                <div className="space-y-2 flex-1">
                  <p className="text-sm text-foreground">
                    Revenue increased by 23% YoY to $4.2B, driven by strong performance in North America and APAC regions.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded border border-primary/20">
                      Page 12, Financial Results
                    </span>
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded border border-primary/20">
                      Page 34, Regional Breakdown
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="max-w-xs px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm">
                  What was the revenue growth?
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask anything..."
                  disabled
                  className="flex-1 bg-card border border-border rounded-lg px-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                />
                <button type="button" disabled className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
