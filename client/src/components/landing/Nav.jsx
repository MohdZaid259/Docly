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
              Features
            </a>
            <a
              href="#pricing"
              onClick={(e) => scrollToSection(e, "pricing")}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              Pricing
            </a>
            <a
              href="#faq"
              onClick={(e) => scrollToSection(e, "faq")}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              FAQ
            </a>
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
              Features
            </a>
            <a
              href="#pricing"
              onClick={(e) => scrollToSection(e, "pricing")}
              className="block px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </a>
            <a
              href="#faq"
              onClick={(e) => scrollToSection(e, "faq")}
              className="block px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              FAQ
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
