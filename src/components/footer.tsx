"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Mail, Train, Laptop, UserIcon, ArrowUp, Code, Heart } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Handle scroll event to show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className="w-full border-t bg-background py-6 sm:py-8 relative">
      {/* Subtle gradient border at the top */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>

      <div className="container">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="w-7 h-7 sm:w-8 sm:h-8 overflow-hidden">
                <Image
                  src="/images/Updated logo.png"
                  alt="Jacob Barkin Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                  loading="lazy"
                />
              </div>
              <span className="font-bold text-base sm:text-lg gradient-text">Jacob Barkin</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Developer, financial education advocate, and technology enthusiast exploring the intersection of technology and education.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-sm sm:text-base text-foreground">Explore</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link href="/projects" className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Laptop className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                  <span>Projects</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                  <UserIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                  <span>About Me</span>
                </Link>
              </li>
              <li>
                <Link href="/public-transportation" className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Train className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                  <span>Research</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                  <span>Contact</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="hidden sm:block">
            <h3 className="font-semibold mb-3 text-sm sm:text-base text-foreground">Quick Links</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link href="/" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-sm sm:text-base text-foreground">Connect</h3>
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <Link
                href="https://github.com/JSB2010"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 sm:p-2 rounded-full bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
                aria-label="GitHub"
              >
                <FaGithub className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://www.linkedin.com/in/jacob-barkin/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 sm:p-2 rounded-full bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="/contact"
                className="p-1.5 sm:p-2 rounded-full bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
                aria-label="Contact"
              >
                <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sr-only">Contact</span>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">
              Feel free to reach out for collaborations!
            </p>
          </div>
        </div>

        <div className="pt-4 sm:pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center text-muted-foreground">
            <Code className="h-3.5 w-3.5 mr-1.5" />
            <span className="text-xs sm:text-sm">Built with</span>
            <Heart className="h-3 w-3 mx-1 text-red-500" />
            <span className="text-xs sm:text-sm">using Next.js & shadcn UI</span>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all z-50 opacity-90 hover:opacity-100"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </footer>
  );
}
