import { Link } from "react-router-dom";
import { BookOpen, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    setIsOpen(false);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 font-bold text-xl">
            <BookOpen className="w-6 h-6 text-primary" />
            <span className="text-foreground">Docly</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#how"
              onClick={(e) => scrollToSection(e, "how")}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              onClick={(e) => scrollToSection(e, "pricing")}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              Pricing
            </a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Log in
            </Link>
            <Link to="/login" className="btn-primary">
              Get Started
            </Link>
          </div>

          <button
            className="md:hidden p-2 hover:bg-accent rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 border-t border-border mt-2 space-y-3">
            <a
              href="#how"
              onClick={(e) => scrollToSection(e, "how")}
              className="block px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              onClick={(e) => scrollToSection(e, "pricing")}
              className="block px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </a>
            <div className="border-t border-border pt-3 px-4 space-y-3">
              <Link to="/login" className="block text-muted-foreground hover:text-foreground transition-colors">
                Log in
              </Link>
              <Link to="/login" className="block btn-primary text-center">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
