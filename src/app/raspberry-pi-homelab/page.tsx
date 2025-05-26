import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProjectDetail } from "@/components/projects/project-detail";
import {
  Server,
  HardDrive,
  Globe,
  Shield,
  Cpu,
  ExternalLink,
  Container,
  Music,
  Film,
  Activity
} from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";

const sharedMetadata = {
  title: "Raspberry Pi 5 Homelab | Jacob Barkin",
  description: "How I built a powerful homelab using a Raspberry Pi 5 with Docker containers, accessible from anywhere using Tailscale and Cloudflare Tunnels.",
  images: [
    {
      url: "/images/Updated logo.png",
      width: 800,
      height: 600,
      alt: "Jacob Barkin Logo",
    },
  ],
};

export const metadata: Metadata = {
  title: sharedMetadata.title,
  description: sharedMetadata.description,
  alternates: {
    canonical: "https://jacobbarkin.com/raspberry-pi-homelab",
  },
  openGraph: {
    ...sharedMetadata,
    url: "https://jacobbarkin.com/raspberry-pi-homelab",
    siteName: "Jacob Barkin Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: sharedMetadata.title,
    description: sharedMetadata.description,
    images: sharedMetadata.images.map((image) => image.url),
    creator: "@jacobbarkin",
    site: "@jacobbarkin",
  },
};

export default function RaspberryPiHomelabPage() {
  return (
    <ProjectDetail
      projectId="raspberry-pi-homelab"
      projectName="Raspberry Pi 5 Homelab"
      showFeedback={true}
    >
      {/* Hero Section */}
      <PageHero
        title="Raspberry Pi 5 Homelab"
        description="Building a powerful and accessible homelab using a Raspberry Pi 5, Docker containers, Tailscale, and Cloudflare Tunnels."
        backgroundImage="/images/mountains-bg.jpg"
        tags={["Docker", "Self-Hosting", "Raspberry Pi", "Homelab"]}
        badge="Hardware Project"
        badgeIcon={true}
        cta={{
          text: "View Resources",
          href: "#resources-section",
          icon: <ExternalLink className="ml-2 h-4 w-4" />
        }}
      />

      {/* Project Overview Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Project Overview</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  In this project, I built a versatile homelab using a Raspberry Pi 5 with 8GB of RAM. The goal was to create a low-power, always-on server that could host various services for my home network while being accessible from anywhere.
                </p>
                <p>
                  Using Docker containers, I deployed multiple services including Dashwatch for monitoring, Uptime Kuma for uptime tracking, Navidrome for music streaming, and Jellyfin for media management.
                </p>
                <p>
                  To make these services securely accessible from anywhere, I implemented a combination of Tailscale for private networking and Cloudflare Tunnels for secure public access without exposing my home IP address.
                </p>
              </div>

              <div className="mt-8">
                <Button asChild variant="outline">
                  <Link href="#resources-section">
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Useful Resources
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center">
                <Server className="h-24 w-24 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Details Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Technical Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4">
                    <Cpu className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Hardware</h3>
                  <p className="text-muted-foreground">
                    Raspberry Pi 5 with 8GB RAM, 256GB SSD for storage, running Raspberry Pi OS Lite (64-bit) for maximum performance and compatibility with Docker.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4">
                    <Container className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Docker Stack</h3>
                  <p className="text-muted-foreground">
                    Docker and Docker Compose for container management, running Dashwatch, Uptime Kuma, Navidrome, Jellyfin, and other services in isolated containers.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4">
                    <Globe className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Remote Access</h3>
                  <p className="text-muted-foreground">
                    Tailscale for secure private network access and Cloudflare Tunnels for exposing selected services to the internet without port forwarding or a static IP.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12">Hosted Services</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ServiceCard
              title="Dashwatch"
              description="A dashboard for monitoring system resources and services, providing at-a-glance status of the entire homelab."
              icon={<Activity />}
            />

            <ServiceCard
              title="Uptime Kuma"
              description="Monitoring tool that tracks the uptime and performance of various services and websites, with alerts for any downtime."
              icon={<Activity />}
            />

            <ServiceCard
              title="Navidrome"
              description="Modern music server and streamer compatible with Subsonic/Airsonic clients, providing access to my music collection from anywhere."
              icon={<Music />}
            />

            <ServiceCard
              title="Jellyfin"
              description="Open source media system for managing and streaming video content, providing a Netflix-like experience for personal media."
              icon={<Film />}
            />
          </div>
        </div>
      </section>

      {/* Challenges & Solutions */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12">Challenges & Solutions</h2>

          <div className="space-y-12">
            <ChallengeItem
              number={1}
              title="Power Efficiency"
              challenge="Ensuring the Raspberry Pi could run 24/7 without excessive power consumption or overheating."
              solution="Implemented proper cooling with a heatsink case, optimized Docker containers, and configured services to use resources efficiently."
              icon={<HardDrive />}
            />

            <ChallengeItem
              number={2}
              title="Remote Access Security"
              challenge="Making services accessible remotely without compromising security or exposing my home network."
              solution="Used Tailscale for encrypted mesh networking and Cloudflare Tunnels to avoid opening ports on my home router."
              icon={<Shield />}
            />

            <ChallengeItem
              number={3}
              title="Resource Constraints"
              challenge="Running multiple services on limited Raspberry Pi hardware without performance issues."
              solution="Carefully tuned Docker resource limits, used lightweight container images, and prioritized critical services."
              icon={<Cpu />}
            />

            <ChallengeItem
              number={4}
              title="Data Persistence"
              challenge="Ensuring data wasn't lost during container updates or system reboots."
              solution="Implemented Docker volumes mapped to the SSD, regular automated backups, and proper shutdown procedures."
              icon={<HardDrive />}
            />
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Project Results</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4">
                    <Server className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">24/7 Availability</h3>
                  <p className="text-muted-foreground mb-6">
                    Created a reliable, always-on server that consumes minimal power while providing essential services.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4">
                    <Globe className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Secure Remote Access</h3>
                  <p className="text-muted-foreground mb-6">
                    Achieved secure access to all services from anywhere without compromising network security.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4">
                    <Container className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Modular System</h3>
                  <p className="text-muted-foreground mb-6">
                    Built a flexible system where new services can be easily added or removed without affecting others.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources-section" className="py-16 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Useful Resources</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4">
                    <Container className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Docker Documentation</h3>
                  <p className="text-muted-foreground mb-6">
                    Official documentation for Docker and Docker Compose, essential for setting up containerized applications.
                  </p>
                  <Button asChild>
                    <Link href="https://docs.docker.com/" target="_blank" rel="noopener noreferrer">
                      Visit Documentation
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4">
                    <Globe className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Cloudflare Tunnels Guide</h3>
                  <p className="text-muted-foreground mb-6">
                    Guide to setting up Cloudflare Tunnels for secure remote access to self-hosted services.
                  </p>
                  <Button asChild>
                    <Link href="https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/" target="_blank" rel="noopener noreferrer">
                      Visit Guide
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </ProjectDetail>
  );
}

function ServiceCard({
  title,
  description,
  icon
}: Readonly<{
  title: string,
  description: string,
  icon: React.ReactNode
}>) {
  return (
    <Card className="bg-card hover:shadow-lg transition-shadow h-full">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-primary/10 shrink-0">
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ChallengeItem({
  number,
  title,
  challenge,
  solution,
  icon
}: Readonly<{
  number: number,
  title: string,
  challenge: string,
  solution: string,
  icon: React.ReactNode
}>) {
  return (
    <div className="flex gap-6">
      <div className="relative">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg">
          {number}
        </div>
        {number < 4 && (
          <div className="absolute top-12 bottom-0 left-1/2 w-0.5 -translate-x-1/2 bg-primary/20 h-16"></div>
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-md bg-primary/10 text-primary">
            {icon}
          </div>
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        <div className="space-y-2">
          <p className="text-muted-foreground"><strong>Challenge:</strong> {challenge}</p>
          <p className="text-muted-foreground"><strong>Solution:</strong> {solution}</p>
        </div>
      </div>
    </div>
  );
}
