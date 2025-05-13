import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProjectMaterials from "./project-materials";
import { ProjectDetail } from "@/components/projects/project-detail";
import {
  Train,
  Bus,
  Bike,
  Users,
  Leaf,
  MapPin,
  Clock,
  Building,
  ArrowRight
} from "lucide-react";
import { OptimizedBackgroundImage } from "@/components/ui/optimized-background-image";
import { LazyLoad } from "@/components/ui/lazy-load";

export const metadata: Metadata = {
  title: "Public Transportation Research | Jacob Barkin",
  description: "Explore my research on public transportation systems in Colorado, focusing on accessibility and sustainability.",
};

export default function PublicTransportationPage() {
  return (
    <ProjectDetail
      projectId="public-transportation-research"
      projectName="Public Transportation Research"
    >
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 overflow-hidden">
        <OptimizedBackgroundImage
          src="/images/mountains-bg.jpg"
          alt="Mountains background"
          priority={true}
          overlayClassName="opacity-30 dark:opacity-20"
        />

        <div className="container relative z-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Public Transportation Research</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Because of my vision, I am unable to drive, so I take public transit as much as possible.
              I like to do research on our current systems, and how to improve them.
            </p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <LazyLoad className="bg-muted/30">
        <section className="py-16">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2">
                <h2 className="text-3xl font-bold mb-4">Project Overview</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    This ongoing research project examines public transportation systems across Colorado, with a particular focus on the Denver metropolitan area. The goal is to identify challenges and opportunities for improving accessibility, efficiency, and sustainability of public transit networks.
                  </p>
                  <p>
                    By analyzing current routes, schedules, and rider experiences, this research aims to provide actionable recommendations for transit authorities and policymakers to enhance service quality and increase ridership.
                  </p>
                </div>
              </div>

              <Card className="overflow-hidden">
                <div className="p-6 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-300 via-teal-400 to-emerald-500 flex items-center justify-center">
                  <Train className="h-16 w-16 text-white" />
                </div>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Ongoing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Colorado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Individual</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">RTD, CDOT</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </LazyLoad>

      {/* Key Focus Areas */}
      <LazyLoad>
        <section className="py-16">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8 text-center">Key Focus Areas</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Accessibility</h3>
                <p className="text-muted-foreground">
                  Analyzing how well transit systems serve people with disabilities, seniors, and those without access to personal vehicles.
                </p>
              </Card>

              <Card className="p-6">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Service Efficiency</h3>
                <p className="text-muted-foreground">
                  Evaluating routes, schedules, and transfer points to identify opportunities for reducing travel time and improving reliability.
                </p>
              </Card>

              <Card className="p-6">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Sustainability</h3>
                <p className="text-muted-foreground">
                  Researching ways to reduce environmental impact through electric buses, transit-oriented development, and increased ridership.
                </p>
              </Card>
            </div>
          </div>
        </section>
      </LazyLoad>

      {/* Current Research */}
      <LazyLoad className="bg-muted/30">
        <section className="py-16">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Current Research</h2>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-semibold mb-4">RTD Bus Network Analysis</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      This analysis examines the Denver Regional Transportation District (RTD) bus network, focusing on route coverage, frequency, and connectivity. By mapping routes against population density and common destinations, this research identifies underserved areas and potential service improvements.
                    </p>
                    <p>
                      The preliminary findings suggest that while major corridors are well-served, many suburban and outlying areas have limited service, particularly during off-peak hours and weekends.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">Route Analysis</span>
                    <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">Frequency Mapping</span>
                    <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">Transit Equity</span>
                  </div>
                </div>

                <Card className="overflow-hidden">
                  <div className="h-48 bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center">
                    <Bus className="h-16 w-16 text-white" />
                  </div>
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-2">Key Statistics</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>- 170+ bus routes analyzed</li>
                      <li>- Coverage gaps identified in 14 neighborhoods</li>
                      <li>- 35% of routes operate at less than optimal frequency</li>
                      <li>- Evening and weekend service limited in 40% of service area</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center md:order-last">
                <Card className="overflow-hidden md:order-last">
                  <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                    <Train className="h-16 w-16 text-white" />
                  </div>
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-2">Key Statistics</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>- 8 rail lines analyzed for accessibility</li>
                      <li>- 23 stations identified for accessibility improvements</li>
                      <li>- Average ridership down 15% from pre-pandemic levels</li>
                      <li>- 9 transit-oriented development opportunities identified</li>
                    </ul>
                  </CardContent>
                </Card>

                <div>
                  <h3 className="text-2xl font-semibold mb-4">Light Rail Accessibility Study</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      This study evaluates the accessibility of RTD&apos;s light rail system for people with disabilities, seniors, and families with young children. The research includes physical assessments of stations, surveys of riders, and comparison with best practices from other transit systems.
                    </p>
                    <p>
                      Initial findings show that while newer stations have good accessibility features, many older stations require upgrades to meet current standards and user expectations.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">Accessibility</span>
                    <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">Station Design</span>
                    <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">User Experience</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Multimodal Integration Research</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      This research explores how different transportation modes (bus, rail, bike share, scooters, etc.) can be better integrated to provide seamless mobility. The study examines physical connections, scheduling coordination, and unified payment systems.
                    </p>
                    <p>
                      Preliminary findings indicate that while Denver has made progress with integrated payment through the RTD Mobile Ticket app, there are significant opportunities to improve physical connections and scheduling coordination between modes.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">Multimodal</span>
                    <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">First/Last Mile</span>
                    <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">Integration</span>
                  </div>
                </div>

                <Card className="overflow-hidden">
                  <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Bike className="h-16 w-16 text-white" />
                  </div>
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-2">Key Statistics</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>- 65% of rail stations have bike sharing stations nearby</li>
                      <li>- 28% of bus stops lack adequate pedestrian access</li>
                      <li>- Average transfer time between modes: 12 minutes</li>
                      <li>- 42% of riders use multiple transportation modes weekly</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </LazyLoad>

      {/* Project Materials */}
      <LazyLoad>
        <section className="py-16">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Project Materials</h2>
            <ProjectMaterials />
          </div>
        </section>
      </LazyLoad>

      {/* Call to Action */}
      <LazyLoad className="bg-gradient-to-r from-primary/20 to-primary/5">
        <section className="py-16">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">Interested in Contributing?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              If you&apos;re interested in public transportation or have insights about Colorado transit systems, I&apos;d love to hear from you. Let&apos;s work together to improve mobility for everyone.
            </p>
            <Button asChild size="lg">
              <Link href="/contact">
                Contact Me
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </LazyLoad>
    </ProjectDetail>
  );
}
