import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProjectDetail } from "@/components/projects/project-detail";
import {
  Tv,
  HardDrive,
  Terminal,
  Cpu,
  FileCode,
  ExternalLink,
  Wrench,
  Layers,
  Download
} from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";

export const metadata: Metadata = {
  title: "Apple TV macOS Project | Jacob Barkin",
  description: "How I installed macOS on a 1st generation Apple TV, transforming it into a functional Mac computer.",
};

export default function MacOSAppleTVPage() {
  return (
    <ProjectDetail
      projectId="macos-apple-tv"
      projectName="Apple TV macOS Project"
      showFeedback={true}
    >
      {/* Hero Section */}
      <PageHero
        title="Apple TV macOS Conversion"
        description="How I transformed a 1st generation Apple TV into a fully functional Mac computer by installing macOS on it."
        backgroundImage="/images/mountains-bg.jpg"
        tags={["macOS", "Apple TV", "Hardware Modification", "Patchstick"]}
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
                  In this project, I successfully converted a 1st generation Apple TV into a fully functional Mac computer by installing macOS on it. The original Apple TV (2007) was built on a modified version of Mac OS X Tiger (10.4.7), making it possible to install a full desktop operating system with some modifications.
                </p>
                <p>
                  The 1st gen Apple TV features an Intel Pentium M processor running at 1GHz, an NVIDIA GeForce Go 7300 GPU, and 256MB of RAM. While these specs are modest by today's standards, they're sufficient to run older versions of macOS with surprising efficiency.
                </p>
                <p>
                  This project required creating a custom patchstick, modifying the EFI bootloader, and installing specialized drivers to make all the hardware components work properly with macOS.
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
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-600 flex items-center justify-center">
                <Tv className="h-24 w-24 text-white" />
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
                  <h3 className="text-xl font-semibold mb-2">Hardware Specs</h3>
                  <p className="text-muted-foreground">
                    Apple TV 1st Gen (2007) with Intel Pentium M 1GHz processor, NVIDIA GeForce Go 7300 GPU with 64MB VRAM, and 256MB RAM. I upgraded the internal storage to a larger capacity drive for better performance.
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
                  <h3 className="text-xl font-semibold mb-2">OS Installation</h3>
                  <p className="text-muted-foreground">
                    Successfully installed Mac OS X Leopard (10.5.8) on the Apple TV. The Pentium M processor in the Apple TV is 32-bit only, which limited the maximum macOS version to Leopard, as Snow Leopard and later require 64-bit processors.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4">
                    <Wrench className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Modifications</h3>
                  <p className="text-muted-foreground">
                    Created a custom patchstick to modify the Apple TV's firmware, installed custom drivers for the NVIDIA GPU, and configured the system for optimal performance with the limited hardware resources.
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
              title="Firmware Access"
              challenge="The Apple TV's firmware is locked down and doesn't allow direct OS installation."
              solution="Created a custom patchstick (USB drive with special software) to gain access to the Apple TV's firmware and enable OS installation."
              icon={<HardDrive />}
            />

            <ChallengeItem
              number={2}
              title="Hardware Compatibility"
              challenge="Standard macOS installers aren't designed to work with Apple TV hardware."
              solution="Modified the Mac OS X Leopard installer to include custom drivers and patches specifically for the Apple TV's hardware components."
              icon={<Cpu />}
            />

            <ChallengeItem
              number={3}
              title="Boot Process"
              challenge="The Apple TV uses a different boot process than standard Mac computers."
              solution="Modified the EFI bootloader to properly initialize the Apple TV hardware and boot into macOS."
              icon={<Terminal />}
            />

            <ChallengeItem
              number={4}
              title="Graphics Acceleration"
              challenge="The NVIDIA GeForce Go 7300 GPU in the Apple TV required special drivers for macOS."
              solution="Installed custom GPU drivers and framebuffer patches to enable proper graphics acceleration in macOS."
              icon={<Tv />}
            />

            <ChallengeItem
              number={5}
              title="Performance Optimization"
              challenge="The limited hardware (1GHz CPU, 256MB RAM) struggled with macOS performance."
              solution="Optimized system settings, disabled unnecessary services, and upgraded the internal storage to improve overall performance."
              icon={<FileCode />}
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
                  <h3 className="text-xl font-semibold mb-2">Full macOS Experience</h3>
                  <p className="text-muted-foreground mb-6">
                    Successfully transformed the Apple TV into a fully functional Mac running Mac OS X Leopard with all essential features working.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4">
                    <Wrench className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Hardware Utilization</h3>
                  <p className="text-muted-foreground mb-6">
                    Repurposed outdated hardware that would otherwise be obsolete, extending the useful life of the device significantly.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4">
                    <Download className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Practical Applications</h3>
                  <p className="text-muted-foreground mb-6">
                    Created a compact, low-power Mac that could be used for basic computing tasks, media playback, and as a home server.
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
                  <h3 className="text-xl font-semibold mb-2">TinkerDifferent Forums</h3>
                  <p className="text-muted-foreground mb-6">
                    Community forum with detailed guides and discussions about installing macOS on the 1st generation Apple TV.
                  </p>
                  <Button asChild>
                    <Link href="https://tinkerdifferent.com/forums/apple-tv-1st-generation.39/" target="_blank" rel="noopener noreferrer">
                      Visit Forums
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
                  <h3 className="text-xl font-semibold mb-2">Low End Mac</h3>
                  <p className="text-muted-foreground mb-6">
                    Resource for information about using older Apple hardware, including the 1st generation Apple TV.
                  </p>
                  <Button asChild>
                    <Link href="https://lowendmac.com/2007/original-apple-tv/" target="_blank" rel="noopener noreferrer">
                      Visit Website
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
