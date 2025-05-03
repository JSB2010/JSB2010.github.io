"use client";

import Link from "next/link";
import Image from "next/image";

import { Mail, Train, Laptop, UserIcon } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-background py-6 sm:py-8">
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 sm:h-5 sm:w-5"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://www.linkedin.com/in/jacob-barkin/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 sm:p-2 rounded-full bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
                aria-label="LinkedIn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 sm:h-5 sm:w-5"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
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
          <p className="text-center text-xs sm:text-sm text-muted-foreground sm:text-left">
            &copy; {currentYear} Jacob Barkin. All rights reserved.
          </p>
          <div className="text-[10px] sm:text-xs text-muted-foreground">
            Built with Next.js and shadcn UI
          </div>
        </div>
      </div>
    </footer>
  );
}
