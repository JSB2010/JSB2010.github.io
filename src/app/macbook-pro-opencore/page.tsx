import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProjectDetail } from "@/components/projects/project-detail";
import {
  Laptop,
  FileCode,
  Terminal,
  HardDrive,
  Cpu,
  ExternalLink,
  Clock,
  Layers,
  GitBranch
} from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";

export const metadata: Metadata = {
  title: "MacBook Pro OpenCore Project | Jacob Barkin",
  description: "How I revitalized my 2010 MacBook Pro by installing multiple macOS versions (10.7-12.0) using OpenCore bootloader.",
  alternates: {
    canonical: "https://jacobbarkin.com/macbook-pro-opencore",
  },
  openGraph: {
    title: "MacBook Pro OpenCore Project | Jacob Barkin",
    description: "How I revitalized my 2010 MacBook Pro by installing multiple macOS versions (10.7-12.0) using OpenCore bootloader.",
    url: "https://jacobbarkin.com/macbook-pro-opencore",
    siteName: "Jacob Barkin Portfolio",
    images: [
      {
        url: "/images/Updated logo.png",
        width: 800,
        height: 600,
        alt: "Jacob Barkin Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MacBook Pro OpenCore Project | Jacob Barkin",
    description: "How I revitalized my 2010 MacBook Pro by installing multiple macOS versions (10.7-12.0) using OpenCore bootloader.",
    images: ["/images/Updated logo.png"],
    creator: "@jacobbarkin",
    site: "@jacobbarkin",
  },
};

export default function MacbookProOpencorePage() {
  return (
    <ProjectDetail
      projectId="macbook-pro-opencore"
      projectName="MacBook Pro OpenCore Project"
      showFeedback={true}
    >
      {/* Hero Section */}
      <PageHero
        title="MacBook Pro Revitalization"
        description="How I breathed new life into my 2010 MacBook Pro by installing every macOS version from 10.7 to 12.0 on different partitions using OpenCore."
        backgroundImage="/images/mountains-bg.jpg"
        tags={["macOS", "OpenCore", "Hardware Modification", "Multi-Boot"]}
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
                  In this personal project, I successfully revitalized my 2010 MacBook Pro by implementing multi-boot capabilities across multiple macOS versions, from Lion (10.7) all the way to Monterey (12.0).
                </p>
                <p>
                  For macOS versions 10.14 (Mojave) and above, I needed to use OpenCore bootloader since Apple dropped official support for my hardware. This required custom configurations, kernel extensions, and ACPI patches to make everything work properly.
                </p>
                <p>
                  The result was a fully functional machine that could boot into six different macOS versions, allowing me to test software compatibility across operating systems and extend the useful life of my hardware by several years.
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
              <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-800 flex items-center justify-center">
                <Laptop className="h-24 w-24 text-white" />
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
                    <Laptop className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Hardware Specs</h3>
                  <p className="text-muted-foreground">
                    MacBook Pro (Mid 2010) with Intel Core 2 Duo processor, upgraded to 8GB RAM and 1TB SSD for improved performance.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4">
                    <Layers className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">OS Versions</h3>
                  <p className="text-muted-foreground">
                    Successfully installed macOS 10.7 (Lion), 10.8 (Mountain Lion), 10.9 (Mavericks), 10.10 (Yosemite), 10.11 (El Capitan), 10.12 (Sierra), 10.13 (High Sierra), 10.14 (Mojave), 10.15 (Catalina), 11.0 (Big Sur), and 12.0 (Monterey).
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4">
                    <GitBranch className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Boot Management</h3>
                  <p className="text-muted-foreground">
                    Used OpenCore bootloader for macOS 10.14+ and native boot for earlier versions, with a custom boot menu to select between operating systems.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Challenges & Solutions */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12">Challenges & Solutions</h2>

          <div className="space-y-12">
            <ChallengeItem
              number={1}
              title="Hardware Compatibility"
              challenge="My 2010 MacBook Pro wasn't officially supported by macOS versions after High Sierra."
              solution="Used OpenCore bootloader with custom kexts to enable hardware support for newer macOS versions."
              icon={<HardDrive />}
            />

            <ChallengeItem
              number={2}
              title="Graphics Acceleration"
              challenge="The NVIDIA GeForce 320M GPU in my MacBook Pro lacked proper drivers in newer macOS versions."
              solution="Implemented custom framebuffer patches and GPU configuration to enable basic acceleration."
              icon={<Laptop />}
            />

            <ChallengeItem
              number={3}
              title="Multi-Boot Configuration"
              challenge="Managing multiple macOS installations on a single drive with a seamless boot experience."
              solution="Created a custom partition scheme with separate EFI partitions and configured OpenCore to detect all installations."
              icon={<Layers />}
            />

            <ChallengeItem
              number={4}
              title="ACPI Patching"
              challenge="Modern macOS versions required ACPI tables that weren't available on my older hardware."
              solution="Created custom DSDT and SSDT patches to provide the necessary hardware information to the OS."
              icon={<FileCode />}
            />

            <ChallengeItem
              number={5}
              title="Performance Optimization"
              challenge="Newer macOS versions were sluggish on the older hardware."
              solution="Disabled unnecessary services, optimized system configurations, and upgraded to an SSD for a 2x performance boost."
              icon={<Clock />}
            />
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Project Results</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4">
                    <Layers className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">11 OS Versions</h3>
                  <p className="text-muted-foreground mb-6">
                    Successfully installed and configured 11 different macOS versions on a single machine.
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
                  <h3 className="text-xl font-semibold mb-2">Extended Lifespan</h3>
                  <p className="text-muted-foreground mb-6">
                    Added 5+ years of usability to a machine that Apple had officially discontinued support for.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4">
                    <Cpu className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">100% Functionality</h3>
                  <p className="text-muted-foreground mb-6">
                    All hardware components working properly, including Wi-Fi, Bluetooth, graphics, and USB ports.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources-section" className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Useful Resources</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4">
                    <FileCode className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">OpenCore Documentation</h3>
                  <p className="text-muted-foreground mb-6">
                    The official OpenCore documentation provides detailed information about configuring the bootloader for various hardware.
                  </p>
                  <Button asChild>
                    <Link href="https://dortania.github.io/OpenCore-Install-Guide/" target="_blank" rel="noopener noreferrer">
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
                    <Terminal className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">MacRumors Legacy Mac Forums</h3>
                  <p className="text-muted-foreground mb-6">
                    A community of users working on keeping older Mac hardware running with modern software.
                  </p>
                  <Button asChild>
                    <Link href="https://forums.macrumors.com/forums/mac-notebooks.102/" target="_blank" rel="noopener noreferrer">
                      Visit Forums
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
        {number < 5 && (
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

