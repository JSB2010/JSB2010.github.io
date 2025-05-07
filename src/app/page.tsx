"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Laptop,
  LineChart,
  Train,
  Code,
  User,
  ArrowRight
} from "lucide-react";
import { useEffect, useState } from "react";

// Import Aceternity UI components
import { BackgroundGradient } from "@/components/ui/aceternity/background-gradient";
import { MovingBorder } from "@/components/ui/aceternity/moving-border";
import { TextRevealCard } from "@/components/ui/aceternity/text-reveal-card";
import { StaticTextCard } from "@/components/ui/aceternity/static-text-card";
import { OptimizedBackgroundImage } from "@/components/ui/optimized-background-image";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { LazyLoad } from "@/components/ui/lazy-load";

export default function Home() {
  // State to store the current greeting
  const [greeting, setGreeting] = useState("Welcome");

  // Function to get time-based greeting
  const getTimeGreeting = () => {
    const currentHour = new Date().getHours();

    // Early morning (midnight to 5:59 AM)
    if (currentHour >= 0 && currentHour < 6) {
      return "Good Night";
    }
    // Morning (6:00 AM to 11:59 AM)
    else if (currentHour >= 6 && currentHour < 12) {
      return "Good Morning";
    }
    // Afternoon (12:00 PM to 5:59 PM)
    else if (currentHour >= 12 && currentHour < 18) {
      return "Good Afternoon";
    }
    // Evening (6:00 PM to 9:59 PM)
    else if (currentHour >= 18 && currentHour < 22) {
      return "Good Evening";
    }
    // Night (10:00 PM to 11:59 PM)
    else {
      return "Good Night";
    }
  };

  // Update greeting when component mounts and set interval to update it
  useEffect(() => {
    // Set initial greeting
    setGreeting(getTimeGreeting());

    // Update greeting every minute to handle time changes
    const intervalId = setInterval(() => {
      setGreeting(getTimeGreeting());
    }, 60000); // 60000 ms = 1 minute

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-24 lg:py-28 overflow-hidden theme-mountains">
        <OptimizedBackgroundImage 
          src="/images/mountains-bg.jpg" 
          alt="Mountains background" 
          priority={true}
          overlayClassName="opacity-30 dark:opacity-20"
        />


        <div className="container relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col gap-6 text-center md:text-left">
              <MovingBorder
                className="p-0.5"
                containerClassName="rounded-full mx-auto md:mx-0 w-fit"
                duration={3000}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background text-primary text-sm font-medium">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                  </span>
                  {greeting}, welcome to my portfolio!
                </div>
              </MovingBorder>

              <StaticTextCard
                text="Jacob Barkin"
                className="border-none shadow-none p-0 bg-transparent"
                gradientText={true}
                textSize="text-3xl sm:text-4xl md:text-5xl"
              >
                <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mt-4 sm:mt-6">
                  Developer & Financial Education Advocate
                </p>
              </StaticTextCard>

              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center md:justify-start">
                <span className="px-2 sm:px-3 py-1 rounded-full bg-primary/10 text-primary text-xs sm:text-sm flex items-center gap-1">
                  <Laptop className="h-3 w-3" /> Developer
                </span>
                <span className="px-2 sm:px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs sm:text-sm flex items-center gap-1">
                  <LineChart className="h-3 w-3" /> Finance
                </span>
                <span className="px-2 sm:px-3 py-1 rounded-full bg-accent/10 text-accent text-xs sm:text-sm flex items-center gap-1">
                  <Code className="h-3 w-3" /> Projects
                </span>
              </div>

              <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto md:mx-0">
                I&apos;m passionate about technology, financial education, and making a positive impact.
                With a focus on accessibility and innovation, I develop solutions that help people learn and grow.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 justify-center md:justify-start">
                <BackgroundGradient className="rounded-xl">
                  <Button
                    asChild
                    size="default"
                    className="bg-primary hover:opacity-90 transition-opacity border-none text-sm sm:text-base h-10 sm:h-11"
                  >
                    <Link href="/projects">
                      <Code className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      View My Projects
                    </Link>
                  </Button>
                </BackgroundGradient>
                <Button
                  variant="outline"
                  asChild
                  size="default"
                  className="border-primary/20 hover:bg-primary/5 text-sm sm:text-base h-10 sm:h-11"
                >
                  <Link href="/about">
                    <User className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    About Me
                  </Link>
                </Button>
              </div>

              <div className="flex gap-3 sm:gap-4 mt-2 justify-center md:justify-start">
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
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span className="sr-only">Contact</span>
                </Link>
              </div>
            </div>

            <div className="flex justify-center md:justify-end mt-6 sm:mt-0">
              <BackgroundGradient className="rounded-full">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full overflow-hidden border-2 sm:border-4 border-background shadow-xl">                  <ResponsiveImage
                    src="/images/Jacob City.png"
                    alt="Jacob Barkin"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 192px, (max-width: 768px) 224px, (max-width: 1024px) 256px, 288px"
                    priority={true}
                    quality={90}
                  />
                </div>
              </BackgroundGradient>
            </div>
          </div>
        </div>
      </section>      {/* Interests Section */}
      <LazyLoad className="py-12 sm:py-16 md:py-20 theme-technology relative overflow-hidden">
        <section>
          <div className="container relative z-10">
            <div className="flex flex-col items-center mb-8 sm:mb-12">
              <TextRevealCard
                text="My Interests"
                revealText="Explore My Passions"
                className="border-none shadow-none p-0 bg-transparent"
              >
                <div className="h-1 w-16 sm:w-20 bg-gradient-blue-green rounded-full mx-auto mt-3 sm:mt-4"></div>
              </TextRevealCard>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {/* Technology Card */}
              <BackgroundGradient className="rounded-xl h-full">
                <Card className="border-0 bg-background/80 backdrop-blur-sm h-full flex flex-col">
                  <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6 flex-grow flex flex-col">
                    <div className="flex flex-col items-center text-center h-full">
                      <MovingBorder className="p-0.5" containerClassName="rounded-full mb-3 sm:mb-4">
                        <div className="p-2 sm:p-3 rounded-full bg-background text-primary">
                          <Laptop className="h-6 w-6 sm:h-8 sm:w-8" />
                        </div>
                      </MovingBorder>
                      <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Technology</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground flex-grow">
                        Software development, accessibility, and creating technology that makes a difference.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </BackgroundGradient>

              {/* Finance Card */}
              <BackgroundGradient className="rounded-xl h-full">
                <Card className="border-0 bg-background/80 backdrop-blur-sm h-full flex flex-col">
                  <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6 flex-grow flex flex-col">
                    <div className="flex flex-col items-center text-center h-full">
                      <MovingBorder className="p-0.5" containerClassName="rounded-full mb-3 sm:mb-4">
                        <div className="p-2 sm:p-3 rounded-full bg-background text-primary">
                          <LineChart className="h-6 w-6 sm:h-8 sm:w-8" />
                        </div>
                      </MovingBorder>
                      <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Finance</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground flex-grow">
                        Empowering youth through financial literacy for a secure future.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </BackgroundGradient>

              {/* Transit Card */}
              <BackgroundGradient className="rounded-xl h-full">
                <Card className="border-0 bg-background/80 backdrop-blur-sm h-full flex flex-col">
                <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6 flex-grow flex flex-col">
                  <div className="flex flex-col items-center text-center h-full">
                    <MovingBorder className="p-0.5" containerClassName="rounded-full mb-3 sm:mb-4">
                      <div className="p-2 sm:p-3 rounded-full bg-background text-primary">
                        <Train className="h-6 w-6 sm:h-8 sm:w-8" />
                      </div>
                    </MovingBorder>
                    <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Transit</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground flex-grow">
                      Research and advocacy for improved public transit systems.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </BackgroundGradient>

            {/* Aviation Card */}
            <BackgroundGradient className="rounded-xl h-full">
              <Card className="border-0 bg-background/80 backdrop-blur-sm h-full flex flex-col">
                <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6 flex-grow flex flex-col">
                  <div className="flex flex-col items-center text-center h-full">
                    <MovingBorder className="p-0.5" containerClassName="rounded-full mb-3 sm:mb-4">
                      <div className="p-2 sm:p-3 rounded-full bg-background text-primary">
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
                          className="h-6 w-6 sm:h-8 sm:w-8"
                        >
                          <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
                        </svg>
                      </div>
                    </MovingBorder>
                    <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Aviation</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground flex-grow">
                      Fascination with aircraft, flight dynamics, and aerospace technology.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </BackgroundGradient>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-12 sm:py-16 md:py-20 theme-space relative overflow-hidden">

        <div className="container relative z-10">
          <div className="flex flex-col items-center mb-8 sm:mb-12">
            <TextRevealCard
              text="Featured Projects"
              revealText="Explore My Work"
              className="border-none shadow-none p-0 bg-transparent"
            >
              <div className="h-1 w-16 sm:w-20 bg-gradient-blue-green rounded-full mx-auto mt-3 sm:mt-4"></div>
            </TextRevealCard>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Ask The Kidz */}
            <Link href="https://www.askthekidz.com" target="_blank" rel="noopener noreferrer" className="block h-full">
              <BackgroundGradient className="rounded-xl h-full">
                <Card className="border-0 bg-background/80 backdrop-blur-sm h-full">
                  <div className="relative h-36 sm:h-40 md:h-48 overflow-hidden rounded-t-xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                      <MovingBorder className="p-0.5" containerClassName="rounded-full">
                        <div className="p-3 sm:p-4 rounded-full bg-background text-primary">
                          <LineChart className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />
                        </div>
                      </MovingBorder>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5 md:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-foreground group-hover:text-primary transition-colors">
                      Ask The Kidz
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-3 sm:line-clamp-none">
                      A platform dedicated to empowering youth through financial education, providing resources and guidance for building a secure financial future.
                    </p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-primary/10 text-primary text-xs">Financial Education</span>
                      <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-secondary/10 text-secondary text-xs">Youth Empowerment</span>
                    </div>
                  </div>
                </Card>
              </BackgroundGradient>
            </Link>

            {/* Public Transportation Research */}
            <Link href="/public-transportation" className="block h-full">
              <BackgroundGradient className="rounded-xl h-full">
                <Card className="border-0 bg-background/80 backdrop-blur-sm h-full">
                  <div className="relative h-36 sm:h-40 md:h-48 overflow-hidden rounded-t-xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary flex items-center justify-center">
                      <MovingBorder className="p-0.5" containerClassName="rounded-full">
                        <div className="p-3 sm:p-4 rounded-full bg-background text-primary">
                          <Train className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />
                        </div>
                      </MovingBorder>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5 md:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-foreground group-hover:text-primary transition-colors">
                      Public Transportation Research
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-3 sm:line-clamp-none">
                      Comprehensive research on public transportation systems in Colorado, focusing on accessibility improvements and sustainable solutions.
                    </p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-primary/10 text-primary text-xs">Research</span>
                      <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-secondary/10 text-secondary text-xs">Accessibility</span>
                      <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-green-500/10 text-green-500 text-xs">Sustainability</span>
                    </div>
                  </div>
                </Card>
              </BackgroundGradient>
            </Link>

            {/* Portfolio Website */}
            <Link href="/projects" className="block h-full">
              <BackgroundGradient className="rounded-xl h-full">
                <Card className="border-0 bg-background/80 backdrop-blur-sm h-full">
                  <div className="relative h-36 sm:h-40 md:h-48 overflow-hidden rounded-t-xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 to-primary/90 flex items-center justify-center">
                      <MovingBorder className="p-0.5" containerClassName="rounded-full">
                        <div className="p-3 sm:p-4 rounded-full bg-background text-primary">
                          <Code className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />
                        </div>
                      </MovingBorder>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5 md:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-foreground group-hover:text-primary transition-colors">
                      Portfolio Website
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-3 sm:line-clamp-none">
                      A modern, responsive portfolio website showcasing my projects, skills, and interests with a focus on accessibility and user experience.
                    </p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-primary/10 text-primary text-xs">Next.js</span>
                      <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-secondary/10 text-secondary text-xs">Tailwind CSS</span>
                      <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs">shadcn UI</span>
                    </div>
                  </div>
                </Card>
              </BackgroundGradient>
            </Link>
          </div>

          <div className="flex justify-center mt-8 sm:mt-10 md:mt-12">
            <MovingBorder className="p-0.5 rounded-lg">
              <Button
                asChild
                className="bg-primary hover:opacity-90 transition-opacity border-none text-sm sm:text-base h-10 sm:h-11"
              >
                <Link href="/projects" className="group">
                  View All Projects
                  <ArrowRight className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </MovingBorder>
          </div>
        </div>
      </section>
    </>
  );
}
