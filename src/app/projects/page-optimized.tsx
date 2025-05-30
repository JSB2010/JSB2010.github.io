import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Train,
  Code,
  ExternalLink,
  Laptop,
  Tv,
  Server
} from "lucide-react";
import { ProjectCard as GitHubProjectCard } from "@/components/project-card";
import { fetchUserRepositories, transformRepoToProjectCard } from "@/lib/github";
import { OptimizedBackgroundImage } from "@/components/ui/optimized-background-image";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { LazyLoad } from "@/components/ui/lazy-load";

import "./projects-fixed.css";

export const metadata: Metadata = {
  title: "Projects | Jacob Barkin",
  description: "Explore Jacob Barkin's projects in technology, technology consulting, and public transportation research.",
};

// Project data
const projects = [
  {
    id: "ask-the-kidz",
    title: "Ask The Kidz",
    description: "A technology consulting business providing tech support and solutions for various devices, software, and smart home setups. Helping people solve their technology challenges with personalized service.",
    image: undefined,
    icon: <LineChart className="h-16 w-16 text-white" />,
    gradient: "from-blue-500 to-purple-600",
    tags: ["Technology Consulting", "Tech Support"],
    link: "https://www.askthekidz.com",
    github: null,
    featured: true,
  },
  {
    id: "public-transportation",
    title: "Public Transportation Research",
    description: "Comprehensive research on public transportation systems in Colorado, focusing on accessibility improvements and sustainable solutions.",
    image: undefined,
    icon: <Train className="h-16 w-16 text-white" />,
    gradient: "from-green-500 to-teal-600",
    tags: ["Research", "Accessibility", "Sustainability"],
    link: "/public-transportation",
    github: null,
    featured: true,
  },
  {
    id: "portfolio-website",
    title: "Portfolio Website",
    description: "A modern, responsive portfolio website showcasing my projects, skills, and interests with a focus on accessibility and user experience.",
    image: undefined,
    icon: <Code className="h-16 w-16 text-white" />,
    gradient: "from-indigo-500 to-blue-600",
    tags: ["Next.js", "Tailwind CSS", "shadcn UI"],
    link: "/portfolio-website",
    github: "https://github.com/JSB2010/jacobbarkin.com",
    featured: true,
  },
  {
    id: "raspberry-pi-homelab",
    title: "Raspberry Pi 5 Homelab",
    description: "Building a powerful homelab using a Raspberry Pi 5 with Docker containers, accessible from anywhere using Tailscale and Cloudflare Tunnels.",
    image: undefined,
    icon: <Server className="h-16 w-16 text-white" />,
    gradient: "from-green-500 to-teal-600",
    tags: ["Docker", "Self-Hosting", "Raspberry Pi"],
    link: "/raspberry-pi-homelab",
    github: null,
    featured: false,
  },
  {
    id: "macbook-pro-opencore",
    title: "MacBook Pro Revitalization",
    description: "How I breathed new life into my 2010 MacBook Pro by installing every macOS version from 10.7 to 12.0 on different partitions using OpenCore bootloader.",
    image: undefined,
    icon: <Laptop className="h-16 w-16 text-white" />,
    gradient: "from-gray-600 to-gray-800",
    tags: ["macOS", "OpenCore", "Hardware Modification"],
    link: "/macbook-pro-opencore",
    github: null,
    featured: false,
  },
  {
    id: "macos-apple-tv",
    title: "Apple TV macOS Conversion",
    description: "How I transformed a 1st generation Apple TV into a fully functional Mac computer by installing macOS on it.",
    image: undefined,
    icon: <Tv className="h-16 w-16 text-white" />,
    gradient: "from-red-500 to-pink-600",
    tags: ["macOS", "Apple TV", "Hardware Modification"],
    link: "/macos-apple-tv",
    github: null,
    featured: false,
  },
];

export default async function ProjectsPage() {
  // Filter featured projects
  const featuredProjects = projects.filter(project => project.featured);
  const otherProjects = projects.filter(project => !project.featured);

  // Fetch GitHub repositories
  const repos = await fetchUserRepositories();

  // Transform GitHub repos to project cards
  const githubProjects = repos
    .filter(repo => !repo.fork && !repo.archived) // Filter out forks and archived repos
    .map(transformRepoToProjectCard);

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-24 overflow-hidden">
        <OptimizedBackgroundImage
          src="/images/mountains-bg.jpg"
          alt="Mountains background"
          priority={true}
          overlayClassName="opacity-30 dark:opacity-20"
        />

        {/* Animated particles for technology theme */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="particle-1 animate-float"></div>
          <div className="particle-2 animate-float"></div>
          <div className="particle-3 animate-float"></div>
        </div>

        <div className="container relative z-20 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mx-auto mb-4 sm:mb-6">
              <span className="relative flex h-2.5 sm:h-3 w-2.5 sm:w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 sm:h-3 w-2.5 sm:w-3 bg-primary"></span>
              </span>
              <span className="ml-1 sm:ml-2">Portfolio Showcase</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6 gradient-text">My Projects</h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore my work across technology, technology consulting, and public transportation research.
            </p>
          </div>
        </div>
      </section>

      {/* Project Categories Navigation */}
      <section className="py-4 sm:py-6 md:py-8 border-b border-border/40 sticky top-0 bg-background/80 backdrop-blur-md z-30">
        <div className="container px-2 sm:px-4">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4">
            <Button variant="ghost" className="rounded-full text-xs sm:text-sm h-8 sm:h-9" size="sm">
              All Projects
            </Button>
            <Button variant="ghost" className="rounded-full text-xs sm:text-sm h-8 sm:h-9" size="sm">
              Featured
            </Button>
            <Button variant="ghost" className="rounded-full text-xs sm:text-sm h-8 sm:h-9" size="sm">
              GitHub
            </Button>
            <Button variant="ghost" className="rounded-full text-xs sm:text-sm h-8 sm:h-9" size="sm">
              Web Development
            </Button>
            <Button variant="ghost" className="rounded-full text-xs sm:text-sm h-8 sm:h-9" size="sm">
              Research
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <LazyLoad>
        <section className="py-10 sm:py-14 md:py-20">
          <div className="container px-4 sm:px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold">Featured Projects</h2>
                <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">Highlighted work and major initiatives</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      </LazyLoad>

      {/* Other Projects */}
      {otherProjects.length > 0 && (
        <LazyLoad className="bg-muted/30">
          <section className="py-10 sm:py-14 md:py-20">
            <div className="container px-4 sm:px-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold">Other Projects</h2>
                  <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">Additional work and smaller initiatives</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {otherProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          </section>
        </LazyLoad>
      )}

      {/* GitHub Projects */}
      <LazyLoad>
        <section className="py-10 sm:py-14 md:py-20">
          <div className="container px-4 sm:px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold">GitHub Projects</h2>
                <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">Open source contributions and personal repositories</p>
              </div>

              <Button
                asChild
                variant="outline"
                className="border-primary/20 hover:bg-primary/5 text-xs sm:text-sm h-9 sm:h-10 mt-3 md:mt-0"
              >
                <Link href="https://github.com/JSB2010" target="_blank" rel="noopener noreferrer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5"
                  >
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                    <path d="M9 18c-4.51 2-5-2-7-2"></path>
                  </svg>
                  View All Repositories
                </Link>
              </Button>
            </div>

            {githubProjects.length > 0 ? (
              <div className="grid-container">
                {githubProjects.map((project) => (
                  <GitHubProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="bg-card rounded-xl p-12 shadow-md text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-10 w-10 text-primary"
                  >
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                    <path d="M9 18c-4.51 2-5-2-7-2"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-4">GitHub Repositories</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                  We couldn&apos;t fetch your GitHub repositories at this time. Please check back later.
                </p>
                <Button asChild size="lg">
                  <Link href="https://github.com/JSB2010" target="_blank" rel="noopener noreferrer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-5 w-5"
                    >
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                      <path d="M9 18c-4.51 2-5-2-7-2"></path>
                    </svg>
                    Visit My GitHub
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </section>
      </LazyLoad>
    </>
  );
}

interface FeaturedProject {
  title: string;
  description: string;
  link: string;
  image?: string;
  icon?: React.ReactNode;
  gradient: string;
  tags: string[];
  github?: string | null;
}

function ProjectCard({ project }: Readonly<{ project: FeaturedProject }>) {
  return (
    <Link
      href={project.link}
      target={project.link.startsWith('http') ? "_blank" : undefined}
      rel={project.link.startsWith('http') ? "noopener noreferrer" : undefined}
      className="block h-full group"
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 overflow-hidden group project-card">
        <div className={`h-36 sm:h-40 md:h-48 bg-gradient-to-r ${project.gradient} flex items-center justify-center relative overflow-hidden`}>
          {project.image ? (
            <ResponsiveImage
              src={project.image}
              alt={project.title}
              width={300}
              height={200}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              priority={false}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            />
          ) : (
            <div className="transition-transform duration-300 group-hover:scale-110 scale-75 sm:scale-90 md:scale-100">
              {project.icon}
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
            <div className="p-3 sm:p-4 text-white">
              <span className="text-xs sm:text-sm font-medium">View Project</span>
            </div>
          </div>
        </div>

        <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <h3 className="text-lg sm:text-xl font-semibold group-hover:text-primary transition-colors">{project.title}</h3>
            {project.link.startsWith('http') && (
              <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0 ml-2" />
            )}
          </div>

          <p className="text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
            {project.tags.map((tag: string) => (
              <span key={tag} className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-muted text-muted-foreground rounded-md text-xs">
                {tag}
              </span>
            ))}
          </div>

          {project.github && (
            <div className="flex items-center text-xs sm:text-sm text-muted-foreground mt-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                <path d="M9 18c-4.51 2-5-2-7-2"></path>
              </svg>
              <span>View on GitHub</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
