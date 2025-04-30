import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Public Transportation Research | Jacob Barkin",
  description: "Explore my research on public transportation systems in Colorado, focusing on accessibility and sustainability.",
};

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProjectMaterials from "./project-materials";
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

export default function PublicTransportationPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50 dark:from-background dark:to-background/80 z-10"></div>
        <div className="absolute inset-0 bg-[url('/images/mountains-bg.jpg')] bg-cover bg-center opacity-20 dark:opacity-10"></div>

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
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold mb-6">Project Overview</h2>
              <p className="text-muted-foreground mb-4">
                I conducted a comprehensive project centered on public transportation in Colorado,
                with a particular emphasis on identifying and exploring potential improvements within the system.
                This project was structured into two distinct components: a rigorous research and writing phase and an action phase.
              </p>
              <p className="text-muted-foreground">
                By combining theoretical knowledge with real-world perspectives, this project heightened my understanding
                of public transportation issues and contributed to the broader conversation about improving transit systems in Colorado.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center">
                <Train className="w-24 h-24 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research Components */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Research Components</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4">
                    <Bus className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Research Paper</h3>
                  <p className="text-muted-foreground">
                    During the research and writing phase, I extensively reviewed existing literature and data related to public transit,
                    analyzing current challenges and best practices in various regions.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Action Piece</h3>
                  <p className="text-muted-foreground">
                    In the action phase, I actively engaged with the community by interviewing individuals directly involved
                    in initiatives to enhance public transit services.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4">
                    <Bike className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Final Presentation</h3>
                  <p className="text-muted-foreground">
                    The culmination of my research resulted in a comprehensive presentation that summarized key findings
                    and proposed actionable recommendations for improving public transportation systems.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Project Materials Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-6">Project Materials</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-center mb-12">
            Below you can explore the documents and presentations created during this project. Click on each tab to view the full content.
          </p>

          <div className="bg-card rounded-xl p-6 shadow-md">
            <ProjectMaterials />
          </div>
        </div>
      </section>

      {/* Get Involved */}
      <section className="py-16">
        <div className="container">
          <div className="bg-card rounded-xl p-8 shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Get Involved in Transit Advocacy</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-center mb-8">
              Interested in improving public transportation in your community? Here are some ways to get involved and make a difference.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-4">
                <div className="p-3 rounded-full bg-primary/10 mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Join Local Transit Groups</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with local advocacy organizations focused on public transportation improvements.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <div className="p-3 rounded-full bg-primary/10 mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Attend Public Meetings</h3>
                <p className="text-sm text-muted-foreground">
                  Participate in public hearings and meetings about transportation planning in your area.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <div className="p-3 rounded-full bg-primary/10 mb-4">
                  <Bus className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Use Public Transit</h3>
                <p className="text-sm text-muted-foreground">
                  Support the system by using it regularly and providing feedback on your experiences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Findings */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Key Findings</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <CaseStudy
              title="Accessibility Challenges"
              icon={<Leaf className="h-8 w-8 text-primary" />}
              description="Many transit systems in Colorado face significant accessibility challenges, particularly for individuals with disabilities and those in underserved communities."
            />

            <CaseStudy
              title="Funding Limitations"
              icon={<Building className="h-8 w-8 text-primary" />}
              description="Inadequate funding remains a major obstacle to expanding and improving public transportation infrastructure across the state."
            />

            <CaseStudy
              title="Service Frequency"
              icon={<Clock className="h-8 w-8 text-primary" />}
              description="Limited service frequency in many areas discourages ridership and reduces the practical utility of public transit for daily commuting."
            />

            <CaseStudy
              title="Regional Connectivity"
              icon={<MapPin className="h-8 w-8 text-primary" />}
              description="Better integration between different transit systems could significantly improve regional mobility and reduce reliance on personal vehicles."
            />
          </div>

          <div className="mt-12 text-center">
            <Button asChild>
              <Link href="/contact" className="flex items-center">
                Contact Me About Transit Research
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

function CaseStudy({ title, icon, description }: Readonly<{ title: string, icon: React.ReactNode, description: string }>) {
  return (
    <div className="bg-card p-6 rounded-lg shadow-sm">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-full bg-primary/10 shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}
