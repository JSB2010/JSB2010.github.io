import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
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

export const metadata: Metadata = {
  title: "Public Transportation Research | Jacob Barkin",
  description: "Explore my research on public transportation systems in Colorado, focusing on accessibility and sustainability.",
};

export default function PublicTransportationPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50 dark:from-background dark:to-background/80 z-10"></div>
        <div className="absolute inset-0 bg-[url('/images/mountains-bg.jpg')] bg-cover bg-center opacity-20 dark:opacity-10"></div>
        
        <div className="container relative z-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Public Transportation Research</h1>
            <div className="h-1 w-20 bg-primary rounded-full mx-auto mb-8"></div>
            <p className="text-xl text-muted-foreground">
              Exploring accessibility, sustainability, and efficiency in Colorado's public transit systems.
            </p>
          </div>
        </div>
      </section>
      
      {/* Introduction Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Public Transportation Matters</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Public transportation is a vital component of urban infrastructure that provides mobility, reduces traffic congestion, and decreases carbon emissions. My research focuses on how public transit systems in Colorado can be improved to better serve communities.
                </p>
                <p>
                  I'm particularly interested in accessibility improvements that make public transportation available to everyone, regardless of physical ability, income level, or geographic location.
                </p>
                <p>
                  Through data analysis, case studies, and community engagement, I aim to identify gaps in current systems and propose sustainable solutions that enhance the public transportation experience for all residents.
                </p>
              </div>
            </div>
            
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center">
                <Train className="h-24 w-24 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Key Focus Areas */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Key Focus Areas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Accessibility</h3>
                  <p className="text-muted-foreground">
                    Ensuring public transportation is accessible to people of all abilities, ages, and income levels through universal design principles and equitable fare structures.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4">
                    <Leaf className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Sustainability</h3>
                  <p className="text-muted-foreground">
                    Researching eco-friendly transit options, renewable energy integration, and reducing the carbon footprint of public transportation systems.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4">
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Efficiency</h3>
                  <p className="text-muted-foreground">
                    Analyzing route optimization, scheduling improvements, and technology integration to enhance the reliability and convenience of public transit.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Case Studies */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12">Colorado Transit Case Studies</h2>
          
          <div className="space-y-12">
            <CaseStudy 
              title="RTD Light Rail Expansion"
              icon={<Train />}
              description="Analysis of the Regional Transportation District's light rail expansion projects in the Denver metropolitan area, focusing on ridership trends, community impact, and accessibility improvements."
            />
            
            <CaseStudy 
              title="Mountain Community Bus Services"
              icon={<Bus />}
              description="Evaluation of bus services in Colorado mountain communities, examining challenges related to seasonal demand, weather conditions, and connecting rural residents to essential services."
            />
            
            <CaseStudy 
              title="Bike Share Programs"
              icon={<Bike />}
              description="Research on the integration of bike share programs with traditional public transit options, creating a more comprehensive and flexible transportation network."
            />
          </div>
        </div>
      </section>
      
      {/* Future Research */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Future Research Directions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-card hover:shadow-lg transition-shadow h-full">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/10 shrink-0">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Transit-Oriented Development</h3>
                    <p className="text-muted-foreground">
                      Investigating how urban planning and development around transit hubs can create more livable, walkable communities while increasing public transportation usage.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card hover:shadow-lg transition-shadow h-full">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/10 shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">First Mile/Last Mile Solutions</h3>
                    <p className="text-muted-foreground">
                      Exploring innovative approaches to address the "first mile/last mile" challenge that often prevents people from using public transportation due to the distance between transit stops and their final destinations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
    </>
  );
}

function CaseStudy({ title, icon, description }: { title: string, icon: React.ReactNode, description: string }) {
  return (
    <div className="flex flex-col md:flex-row gap-6 items-start">
      <div className="p-4 rounded-xl bg-primary/10 text-primary shrink-0">
        {icon}
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        <Link href="#" className="inline-flex items-center text-primary hover:underline">
          Read more <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
