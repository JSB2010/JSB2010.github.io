import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Train,
  Code,
  ExternalLink,
  Laptop,
  Monitor
} from "lucide-react";
import { ProjectCard as GitHubProjectCard } from "@/components/project-card";
import { fetchUserRepositories, transformRepoToProjectCard } from "@/lib/github";

import "./projects-fixed.css";



export const metadata: Metadata = {
  title: "Projects | Jacob Barkin",
  description: "Explore Jacob Barkin's projects in technology, financial education, and public transportation research.",
};

// Project data
const projects = [
  {
    id: "ask-the-kidz",
    title: "Ask The Kidz",
    description: "A platform dedicated to empowering youth through financial education, providing resources and guidance for building a secure financial future.",
    image: null,
    icon: <LineChart className="h-16 w-16 text-white" />,
    gradient: "from-blue-500 to-purple-600",
    tags: ["Financial Education", "Youth Empowerment"],
    link: "https://www.askthekidz.com",
    github: null,
    featured: true,
  },
  {
    id: "public-transportation",
    title: "Public Transportation Research",
    description: "Comprehensive research on public transportation systems in Colorado, focusing on accessibility improvements and sustainable solutions.",
    image: null,
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
    image: null,
    icon: <Code className="h-16 w-16 text-white" />,
    gradient: "from-indigo-500 to-blue-600",
    tags: ["Next.js", "Tailwind CSS", "shadcn UI"],
    link: "/",
    github: "https://github.com/JSB2010/JSB2010.github.io",
    featured: true,
  },
  {
    id: "macbook-pro-opencore",
    title: "MacBook Pro OpenCore",
    description: "A guide and configuration for installing macOS on older MacBook Pro models using OpenCore bootloader.",
    image: null,
    icon: <Laptop className="h-16 w-16 text-white" />,
    gradient: "from-gray-600 to-gray-800",
    tags: ["macOS", "OpenCore", "Hardware"],
    link: "/macbook-pro-opencore",
    github: null,
    featured: false,
  },
  {
    id: "macos-apple-tv",
    title: "macOS Apple TV Integration",
    description: "A project exploring the integration between macOS and Apple TV for enhanced media experiences.",
    image: null,
    icon: <Monitor className="h-16 w-16 text-white" />,
    gradient: "from-red-500 to-pink-600",
    tags: ["macOS", "Apple TV", "Integration"],
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
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50 dark:from-background dark:to-background/80 z-10"></div>
        <div className="absolute inset-0 bg-[url('/images/mountains-bg.jpg')] bg-cover bg-center opacity-20 dark:opacity-10"></div>

        {/* Animated particles for technology theme */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="particle-1 animate-float"></div>
          <div className="particle-2 animate-float"></div>
          <div className="particle-3 animate-float"></div>
        </div>

        <div className="container relative z-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mx-auto mb-6">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              <span className="ml-2">Portfolio Showcase</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 gradient-text">My Projects</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore my work across technology, financial education, and public transportation research.
            </p>
          </div>
        </div>
      </section>

      {/* Project Categories Navigation */}
      <section className="py-8 border-b border-border/40 sticky top-0 bg-background/80 backdrop-blur-md z-30">
        <div className="container">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button variant="ghost" className="rounded-full" size="sm">
              All Projects
            </Button>
            <Button variant="ghost" className="rounded-full" size="sm">
              Featured
            </Button>
            <Button variant="ghost" className="rounded-full" size="sm">
              GitHub
            </Button>
            <Button variant="ghost" className="rounded-full" size="sm">
              Web Development
            </Button>
            <Button variant="ghost" className="rounded-full" size="sm">
              Research
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
            <div>
              <h2 className="text-3xl font-bold">Featured Projects</h2>
              <p className="text-muted-foreground mt-2">Highlighted work and major initiatives</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* Other Projects */}
      {otherProjects.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
              <div>
                <h2 className="text-3xl font-bold">Other Projects</h2>
                <p className="text-muted-foreground mt-2">Additional work and smaller initiatives</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* GitHub Projects */}
      <section className="py-20">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
            <div>
              <h2 className="text-3xl font-bold">GitHub Projects</h2>
              <p className="text-muted-foreground mt-2">Open source contributions and personal repositories</p>
            </div>

            <Button asChild variant="outline" className="border-primary/20 hover:bg-primary/5">
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
                View All Repositories
              </Link>
            </Button>
          </div>

          {githubProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                We couldn't fetch your GitHub repositories at this time. Please check back later.
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
    </>
  );
}

function ProjectCard({ project }: Readonly<{ project: any }>) {
  return (
    <Link
      href={project.link}
      target={project.link.startsWith('http') ? "_blank" : undefined}
      rel={project.link.startsWith('http') ? "noopener noreferrer" : undefined}
      className="block h-full group"
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 overflow-hidden group project-card">
        <div className={`h-48 bg-gradient-to-r ${project.gradient} flex items-center justify-center relative overflow-hidden`}>
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title}
              width={300}
              height={200}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="transition-transform duration-300 group-hover:scale-110">
              {project.icon}
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
            <div className="p-4 text-white">
              <span className="text-sm font-medium">View Project</span>
            </div>
          </div>
        </div>

        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{project.title}</h3>
            {project.link.startsWith('http') && (
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            )}
          </div>

          <p className="text-muted-foreground mb-4 line-clamp-2">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag: string) => (
              <span key={tag} className="px-2 py-1 bg-muted text-muted-foreground rounded-md text-xs">
                {tag}
              </span>
            ))}
          </div>

          {project.github && (
            <div className="flex items-center text-sm text-muted-foreground mt-auto">
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
                className="mr-2"
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
