import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Laptop,
  ChartLineUp,
  Train,
  Code,
  User,
  ArrowRight
} from "lucide-react";

export default function Home() {
  // Dynamic greeting based on time of day
  const getTimeGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return "Good Morning";
    if (currentHour < 18) return "Good Afternoon";
    if (currentHour < 21) return "Good Evening";
    return "Good Night";
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50 dark:from-background dark:to-background/80 z-10"></div>
        <div className="absolute inset-0 bg-[url('/images/mountains-bg.jpg')] bg-cover bg-center opacity-20 dark:opacity-10"></div>

        <div className="container relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col gap-6">
              <p className="text-lg text-muted-foreground">{getTimeGreeting()}, welcome to my portfolio!</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Jacob Barkin
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground">
                Developer & Financial Education Advocate
              </p>
              <p className="text-muted-foreground max-w-md">
                I'm passionate about technology, financial education, and making a positive impact.
                With a focus on accessibility and innovation, I develop solutions that help people learn and grow.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <Button asChild size="lg">
                  <Link href="/projects">
                    <Code className="mr-2 h-5 w-5" />
                    View My Projects
                  </Link>
                </Button>
                <Button variant="outline" asChild size="lg">
                  <Link href="/about">
                    <User className="mr-2 h-5 w-5" />
                    About Me
                  </Link>
                </Button>
              </div>

              <div className="flex gap-4 mt-2">
                <Link
                  href="https://github.com/JSB2010"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
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
                    className="h-6 w-6"
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
                  className="text-muted-foreground hover:text-foreground transition-colors"
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
                    className="h-6 w-6"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                  <span className="sr-only">LinkedIn</span>
                </Link>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors"
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
                    className="h-6 w-6"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span className="sr-only">Contact</span>
                </Link>
              </div>
            </div>

            <div className="flex justify-center md:justify-end">
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-background shadow-xl">
                <Image
                  src="/images/Jacob City.png"
                  alt="Jacob Barkin"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interests Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">My Interests</h2>
            <div className="h-1 w-20 bg-primary rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4">
                    <Laptop className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Technology</h3>
                  <p className="text-muted-foreground">
                    I'm passionate about software development, accessibility, and creating technology that makes a difference in people's lives.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4">
                    <ChartLineUp className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Financial Education</h3>
                  <p className="text-muted-foreground">
                    I believe in empowering youth through financial literacy, helping them build the skills they need for a secure future.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4">
                    <Train className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Public Transportation</h3>
                  <p className="text-muted-foreground">
                    I research and advocate for improved public transit systems, focusing on accessibility and sustainability.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20">
        <div className="container">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Featured Projects</h2>
            <div className="h-1 w-20 bg-primary rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="https://www.askthekidz.com" target="_blank" rel="noopener noreferrer">
              <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden group">
                <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <ChartLineUp className="h-16 w-16 text-white" />
                </div>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Ask The Kidz</h3>
                  <p className="text-muted-foreground mb-4">
                    A platform dedicated to empowering youth through financial education, providing resources and guidance for building a secure financial future.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-muted text-muted-foreground rounded-md text-xs">Financial Education</span>
                    <span className="px-2 py-1 bg-muted text-muted-foreground rounded-md text-xs">Youth Empowerment</span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/public-transportation">
              <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden group">
                <div className="h-48 bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center">
                  <Train className="h-16 w-16 text-white" />
                </div>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Public Transportation Research</h3>
                  <p className="text-muted-foreground mb-4">
                    Comprehensive research on public transportation systems in Colorado, focusing on accessibility improvements and sustainable solutions.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-muted text-muted-foreground rounded-md text-xs">Research</span>
                    <span className="px-2 py-1 bg-muted text-muted-foreground rounded-md text-xs">Accessibility</span>
                    <span className="px-2 py-1 bg-muted text-muted-foreground rounded-md text-xs">Sustainability</span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/projects">
              <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden group">
                <div className="h-48 bg-gradient-to-r from-indigo-500 to-blue-600 flex items-center justify-center">
                  <Code className="h-16 w-16 text-white" />
                </div>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Portfolio Website</h3>
                  <p className="text-muted-foreground mb-4">
                    A modern, responsive portfolio website showcasing my projects, skills, and interests with a focus on accessibility and user experience.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-muted text-muted-foreground rounded-md text-xs">Next.js</span>
                    <span className="px-2 py-1 bg-muted text-muted-foreground rounded-md text-xs">Tailwind CSS</span>
                    <span className="px-2 py-1 bg-muted text-muted-foreground rounded-md text-xs">shadcn UI</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="flex justify-center mt-10">
            <Button asChild variant="outline">
              <Link href="/projects" className="group">
                View All Projects
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
