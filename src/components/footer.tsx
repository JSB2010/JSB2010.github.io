"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Mail, Train, Laptop, UserIcon, ArrowUp, Code, Heart } from "lucide-react";
import { SocialIcons } from "@/components/ui/social-icons";

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
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

            {/* Mobile Social Links */}
            <div className="flex items-center gap-3 mt-3 sm:hidden">
              <SocialIcons size="sm" />
            </div>
          </div>

          {/* Mobile Navigation Grid */}
          <div className="mt-4 sm:hidden">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2 text-sm text-foreground">Explore</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-primary">
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                      </svg>
                      <span>Home</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/projects" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                      <Laptop className="h-4 w-4 text-primary" />
                      <span>Projects</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                      <UserIcon className="h-4 w-4 text-primary" />
                      <span>About Me</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                      <Mail className="h-4 w-4 text-primary" />
                      <span>Contact</span>
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-sm text-foreground">More Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/public-transportation" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                      <Train className="h-4 w-4 text-primary" />
                      <span>Research</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/portfolio-website" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                      <Code className="h-4 w-4 text-primary" />
                      <span>Portfolio</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/macbook-pro-opencore" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-primary">
                        <rect width="18" height="12" x="3" y="4" rx="2" ry="2"></rect>
                        <line x1="2" x2="22" y1="20" y2="20"></line>
                      </svg>
                      <span>MacBook</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/dashboard" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-primary">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                      <span>Admin</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:block">
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

          <div className="hidden sm:block">
            <h3 className="font-semibold mb-3 text-sm sm:text-base text-foreground">Connect</h3>
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <SocialIcons size="sm" />
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
          className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 p-2.5 sm:p-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all z-50 opacity-90 hover:opacity-100"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </footer>
  );
}
