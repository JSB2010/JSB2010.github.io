"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { SignInButton } from "@/components/auth/sign-in-button";

import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Projects", path: "/projects" },
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
            <div className="w-8 h-8 sm:w-10 sm:h-10 overflow-hidden transition-transform group-hover:scale-110">
              <Image
                src="/images/Updated logo.png"
                alt="Jacob Barkin Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <span className="font-bold text-lg sm:text-xl gradient-text">Jacob Barkin</span>
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
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile Navigation */}
        <Sheet defaultOpen={false}>
          <SheetTrigger asChild className="md:hidden">
            <Button
              variant="outline"
              size="icon"
              className="border-primary/20 hover:bg-primary/5 h-10 w-10 rounded-full"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="border-l-primary/20 w-[280px] sm:w-[350px]"
            aria-label="Navigation Menu"
          >
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <SheetDescription className="sr-only">Navigation links for Jacob Barkin&apos;s website</SheetDescription>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 overflow-hidden">
                <Image
                  src="/images/Updated logo.png"
                  alt="Jacob Barkin Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                  priority
                />
              </div>
              <span className="font-bold text-xl gradient-text">Jacob Barkin</span>
            </div>
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center text-base font-medium transition-all hover:text-primary p-3 rounded-md ${
                    pathname === item.path
                      ? "text-primary bg-primary/10 font-semibold"
                      : "text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  {item.name}
                  {pathname === item.path && (
                    <div className="ml-2 h-1.5 w-1.5 rounded-full bg-primary"></div>
                  )}
                </Link>
              ))}
              <div className="mt-6 pt-6 border-t flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Theme mode</span>
                  <ThemeToggle />
                </div>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
