"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Projects", path: "/projects" },
  { name: "Public Transportation", path: "/public-transportation" },
  { name: "Contact", path: "/contact" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="bg-gradient-blue-green h-1"></div>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-full bg-gradient-blue-green flex items-center justify-center text-white font-bold text-lg transition-transform group-hover:scale-110">
              JB
            </div>
            <span className="font-bold text-xl gradient-text">Jacob Barkin</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`text-sm font-medium transition-all hover:text-primary relative group ${
                pathname === item.path
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              {item.name}
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-blue-green transition-all duration-300 group-hover:w-full ${
                pathname === item.path ? "w-full" : "w-0"
              }`}></span>
            </Link>
          ))}
          <ThemeToggle />
        </nav>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon" className="border-primary/20 hover:bg-primary/5">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="border-l-primary/20">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 rounded-full bg-gradient-blue-green flex items-center justify-center text-white font-bold text-lg">
                JB
              </div>
              <span className="font-bold text-xl gradient-text">Jacob Barkin</span>
            </div>
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`text-sm font-medium transition-all hover:text-primary p-2 rounded-md ${
                    pathname === item.path
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t">
                <ThemeToggle />
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
