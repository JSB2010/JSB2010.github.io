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
import { PageHero } from "@/components/ui/page-hero";

// Configure for static export
export const dynamic = "force-static";
export const revalidate = false;

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
      <PageHero
        title="Public Transportation Research"
        description="As someone who relies on public transit due to my vision, I've conducted extensive research on Colorado's transit systems with a focus on accessibility, equity, and sustainability. This project examines how we can create more inclusive and efficient transportation networks."
        backgroundImage="/images/mountains-bg.jpg"
        tags={["Accessibility", "Equity", "Sustainability", "Public Transit"]}
        badge="Research Project"
        badgeIcon={true}
      />

      {/* Overview Section */}
      <LazyLoad className="bg-muted/30">
        <section className="py-16">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2">
                <h2 className="text-3xl font-bold mb-4">Project Overview</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    This research project investigates the current state of public transportation in Colorado, with a special emphasis on the Regional Transportation District (RTD) serving the Denver metro area. The research addresses critical issues of accessibility, equity, and the environmental impact of our transit systems.
                  </p>
                  <p>
                    Through detailed analysis of transit routes, service frequency, and accessibility features, this project identifies significant gaps in service, particularly for people with disabilities, low-income communities, and those living in suburban and rural areas. The research proposes specific policy changes and infrastructure improvements to create a more inclusive and sustainable transit network.
                  </p>
                  <p>
                    The findings highlight how improved public transportation can reduce carbon emissions, decrease traffic congestion, and provide essential mobility options for all residents regardless of age, ability, or economic status.
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
                <h3 className="text-xl font-semibold mb-2">Accessibility & Equity</h3>
                <p className="text-muted-foreground">
                  Examining physical accessibility features at stations and on vehicles, as well as service equity across different neighborhoods and demographic groups. The research identifies significant disparities in transit access and proposes solutions to address these inequities.
                </p>
              </Card>

              <Card className="p-6">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Service Improvements</h3>
                <p className="text-muted-foreground">
                  Analyzing service frequency, reliability, and coverage to identify critical gaps. The research shows that many areas have insufficient service, especially during evenings and weekends, and recommends specific route adjustments and frequency improvements to better serve riders.
                </p>
              </Card>

              <Card className="p-6">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Environmental Impact</h3>
                <p className="text-muted-foreground">
                  Evaluating how expanded public transit can reduce carbon emissions and improve air quality. The research calculates potential emission reductions from increased ridership and fleet electrification, showing how transit improvements align with Colorado's climate goals.
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
                      This comprehensive analysis of RTD's bus network reveals significant service disparities across the Denver metro area. Using GIS mapping and demographic data, the research shows that low-income neighborhoods and communities of color often have less frequent and less reliable service despite higher transit dependency.
                    </p>
                    <p>
                      The study found that 42% of high-transit-need areas have service gaps during evenings and weekends, and 38% of bus stops lack adequate accessibility features like shelters, benches, and ADA-compliant boarding areas. The research proposes a network redesign that would increase service frequency in underserved areas without requiring significant additional resources.
                    </p>
                    <p>
                      The analysis also examines the impact of RTD's recent service cuts and recommends prioritizing service restoration based on equity considerations and ridership potential.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">Service Equity</span>
                    <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">Network Redesign</span>
                    <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">Stop Accessibility</span>
                  </div>
                </div>

                <Card className="overflow-hidden">
                  <div className="h-48 bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center">
                    <Bus className="h-16 w-16 text-white" />
                  </div>
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-2">Key Statistics</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>- 142 active bus routes analyzed (down from 170+ pre-pandemic)</li>
                      <li>- 23 neighborhoods identified with critical service gaps</li>
                      <li>- 47% of routes operate below recommended frequency standards</li>
                      <li>- 38% of bus stops lack adequate accessibility features</li>
                      <li>- 42% of high-need areas have insufficient evening/weekend service</li>
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
                      <li>- All 8 rail lines and 54 stations evaluated</li>
                      <li>- 23 stations require significant accessibility upgrades</li>
                      <li>- 31% of stations lack adequate tactile warning strips</li>
                      <li>- 42% have problematic platform-to-train gaps</li>
                      <li>- $18.5M estimated cost for critical accessibility improvements</li>
                    </ul>
                  </CardContent>
                </Card>

                <div>
                  <h3 className="text-2xl font-semibold mb-4">Light Rail Accessibility Study</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      This detailed accessibility audit of RTD's light rail system reveals significant inconsistencies across the network. The study included on-site evaluations of all 54 rail stations, interviews with riders with disabilities, and comparisons with accessibility standards from transit systems in Portland, Seattle, and Minneapolis.
                    </p>
                    <p>
                      The research found that while newer stations built after 2010 generally meet or exceed ADA requirements, 23 older stations have critical accessibility deficiencies including insufficient platform tactile warnings, problematic gaps between platforms and trains, and inadequate audio announcements for visually impaired riders.
                    </p>
                    <p>
                      The study proposes a prioritized list of accessibility improvements and estimates their costs, highlighting how relatively modest investments could significantly improve usability for all riders, especially those with disabilities.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">ADA Compliance</span>
                    <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">Universal Design</span>
                    <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">Station Improvements</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Multimodal Integration Research</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      This research examines how to create a more seamless transportation system by better integrating RTD services with other mobility options including bike sharing, scooters, ride-hailing, and pedestrian infrastructure. The study includes detailed case studies of successful multimodal integration in cities like Portland, Minneapolis, and Vancouver.
                    </p>
                    <p>
                      The research identifies critical "first mile/last mile" connection challenges in the Denver region, where 28% of bus stops and 35% of rail stations lack safe, convenient connections to surrounding neighborhoods. It proposes specific improvements including enhanced bike parking at transit hubs, dedicated pickup/dropoff zones for ride-hailing services, and improved pedestrian pathways.
                    </p>
                    <p>
                      The study also evaluates RTD's fare structure and mobile app, recommending improvements to create a more integrated payment system that would allow riders to seamlessly use multiple transportation modes with a single payment method.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">First/Last Mile</span>
                    <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">Mobility Hubs</span>
                    <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">Integrated Payment</span>
                  </div>
                </div>

                <Card className="overflow-hidden">
                  <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Bike className="h-16 w-16 text-white" />
                  </div>
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-2">Key Statistics</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>- 72% of rail stations have bike sharing stations within 500 feet</li>
                      <li>- 28% of bus stops and 35% of rail stations lack safe connections</li>
                      <li>- Average transfer time between modes: 13.5 minutes</li>
                      <li>- 53% of surveyed riders use multiple transportation modes weekly</li>
                      <li>- 12 potential mobility hub locations identified across the region</li>
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
            <h2 className="text-3xl font-bold mb-4">Join the Conversation</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              This research highlights how improved public transportation can create more equitable, sustainable, and accessible communities. If you have insights about Colorado transit systems or want to discuss potential collaborations on transit advocacy, I'd love to connect with you. Together, we can work toward transportation systems that serve everyone.
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
