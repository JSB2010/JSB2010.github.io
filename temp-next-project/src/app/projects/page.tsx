import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChartLineUp, 
  Train, 
  Code, 
  ExternalLink,
  Github,
  Laptop,
  Monitor
} from "lucide-react";

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
    icon: <ChartLineUp className="h-16 w-16 text-white" />,
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

export default function ProjectsPage() {
  // Filter featured projects
  const featuredProjects = projects.filter(project => project.featured);
  const otherProjects = projects.filter(project => !project.featured);
  
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50 dark:from-background dark:to-background/80 z-10"></div>
        <div className="absolute inset-0 bg-[url('/images/mountains-bg.jpg')] bg-cover bg-center opacity-20 dark:opacity-10"></div>
        
        <div className="container relative z-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">My Projects</h1>
            <div className="h-1 w-20 bg-primary rounded-full mx-auto mb-8"></div>
            <p className="text-xl text-muted-foreground">
              Explore my work across technology, financial education, and public transportation research.
            </p>
          </div>
        </div>
      </section>
      
      {/* Featured Projects */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12">Featured Projects</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Other Projects */}
      {otherProjects.length > 0 && (
        <section className="py-16 bg-muted/50">
          <div className="container">
            <h2 className="text-3xl font-bold mb-12">Other Projects</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* GitHub Section */}
      <section className="py-16">
        <div className="container">
          <div className="bg-card rounded-xl p-8 shadow-md text-center">
            <Github className="h-16 w-16 mx-auto mb-6 text-primary" />
            <h2 className="text-2xl font-bold mb-4">More Projects on GitHub</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Check out my GitHub profile for more projects, code samples, and contributions to open source.
            </p>
            <Button asChild size="lg">
              <Link href="https://github.com/JSB2010" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-5 w-5" />
                Visit My GitHub
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

function ProjectCard({ project }: { project: any }) {
  return (
    <Link href={project.link} target={project.link.startsWith('http') ? "_blank" : undefined} rel={project.link.startsWith('http') ? "noopener noreferrer" : undefined}>
      <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden group">
        <div className={`h-48 bg-gradient-to-r ${project.gradient} flex items-center justify-center`}>
          {project.image ? (
            <Image 
              src={project.image} 
              alt={project.title} 
              width={300}
              height={200}
              className="object-cover w-full h-full"
            />
          ) : (
            project.icon
          )}
        </div>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{project.title}</h3>
            {project.link.startsWith('http') && (
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <p className="text-muted-foreground mb-4">
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
            <div className="flex items-center text-sm text-muted-foreground">
              <Github className="h-4 w-4 mr-2" />
              <span>View on GitHub</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
