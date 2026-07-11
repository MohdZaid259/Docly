import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <div className="space-y-6 max-w-2xl">
            <div className="inline-block px-4 py-2 border border-primary/30 rounded-full text-sm text-muted-foreground">
              Powered by <span className="text-primary font-semibold">MeshAPI</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-balance leading-tight">
              Answers from your documents, <span className="text-primary">with proof</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              Upload a document, ask a question, get an answer with the exact page it came from — not a guess.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
              <Link to="/login" className="btn-primary flex items-center justify-center gap-2">
                Start Free <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <p className="text-sm text-muted-foreground">
              No credit card required.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
