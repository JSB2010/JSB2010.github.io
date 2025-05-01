import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Monitor,
  Tv,
  Play,
  Cast,
  Smartphone,
  Laptop,
  ArrowRight
} from "lucide-react";

export const metadata: Metadata = {
  title: "macOS Apple TV Integration | Jacob Barkin",
  description: "Explore the integration between macOS and Apple TV for enhanced media experiences.",
};

export default function MacOSAppleTVPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50 dark:from-background dark:to-background/80 z-10"></div>
        <div className="absolute inset-0 bg-[url('/images/mountains-bg.jpg')] bg-cover bg-center opacity-20 dark:opacity-10"></div>

        <div className="container relative z-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">macOS Apple TV Integration</h1>
            <div className="h-1 w-20 bg-primary rounded-full mx-auto mb-8"></div>
            <p className="text-xl text-muted-foreground">
              Exploring the seamless integration between macOS and Apple TV for enhanced media experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">The Apple Ecosystem Advantage</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  One of the greatest strengths of Apple&apos;s product lineup is the seamless integration between devices. The connection between macOS and Apple TV is a perfect example of this ecosystem advantage.
                </p>
                <p>
                  From AirPlay mirroring to the Apple TV app on macOS, Apple has created multiple ways for these devices to work together, enhancing your entertainment experience.
                </p>
                <p>
                  This guide explores the various integration points between macOS and Apple TV, providing tips and tricks to get the most out of these connected devices.
                </p>
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

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Key Integration Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4">
                    <Cast className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">AirPlay Mirroring</h3>
                  <p className="text-muted-foreground">
                    Stream your Mac's display wirelessly to your Apple TV, perfect for presentations, sharing photos, or watching videos on a larger screen.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4">
                    <Play className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Apple TV App</h3>
                  <p className="text-muted-foreground">
                    Access your Apple TV+ subscription, purchased movies, and TV shows directly from your Mac with the dedicated Apple TV application.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4">
                    <Smartphone className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Siri Remote Control</h3>
                  <p className="text-muted-foreground">
                    Use your iPhone or iPad as a remote control for your Apple TV, with the added ability to type using your Mac&apos;s keyboard for easier text entry.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Setup Guide */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12">Setting Up macOS and Apple TV Integration</h2>

          <div className="space-y-12">
            <SetupStep
              number={1}
              title="Ensure Both Devices Are on the Same Network"
              description="Make sure your Mac and Apple TV are connected to the same Wi-Fi network to enable communication between the devices."
              icon={<Cast />}
            />

            <SetupStep
              number={2}
              title="Enable AirPlay on Apple TV"
              description="On your Apple TV, go to Settings > AirPlay and HomeKit > AirPlay and make sure it's turned on."
              icon={<Tv />}
            />

            <SetupStep
              number={3}
              title="Use AirPlay from Your Mac"
              description="Click on the Control Center icon in your Mac's menu bar, select Screen Mirroring, and choose your Apple TV from the list."
              icon={<Monitor />}
            />

            <SetupStep
              number={4}
              title="Install the Apple TV App"
              description="If it's not already installed, download the Apple TV app from the Mac App Store to access your Apple TV+ content."
              icon={<Play />}
            />

            <SetupStep
              number={5}
              title="Set Up Home Sharing"
              description="Enable Home Sharing in the Music and TV apps on your Mac to share your media library with your Apple TV."
              icon={<Laptop />}
            />
          </div>
        </div>
      </section>

      {/* Tips and Tricks */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Pro Tips for Better Integration</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-card hover:shadow-lg transition-shadow h-full">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/10 shrink-0">
                    <Monitor className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Use as a Secondary Display</h3>
                    <p className="text-muted-foreground">
                      Instead of mirroring your Mac&apos;s display, use your Apple TV as a secondary display by holding the Option key when clicking the AirPlay icon and selecting &quot;Use As Separate Display.&quot;
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-shadow h-full">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/10 shrink-0">
                    <Play className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Picture-in-Picture</h3>
                    <p className="text-muted-foreground">
                      When watching content in the Apple TV app on your Mac, use the Picture-in-Picture feature to continue watching while working in other applications.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-shadow h-full">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/10 shrink-0">
                    <Smartphone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Remote App Shortcuts</h3>
                    <p className="text-muted-foreground">
                      When using your iPhone as an Apple TV remote, swipe down from the top of the screen to access additional controls and keyboard input options.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-shadow h-full">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/10 shrink-0">
                    <Cast className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Optimize for AirPlay</h3>
                    <p className="text-muted-foreground">
                      For the best AirPlay performance, use a wired Ethernet connection for your Apple TV if possible, and close unnecessary applications on your Mac to reduce network congestion.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Related Resources */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Related Resources</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Link href="https://support.apple.com/en-us/HT204289" target="_blank" rel="noopener noreferrer">
              <Card className="bg-card hover:shadow-lg transition-shadow h-full group">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Apple Support: AirPlay</h3>
                  <p className="text-muted-foreground mb-4">
                    Official Apple support documentation for using AirPlay with your Mac and Apple TV.
                  </p>
                  <div className="flex items-center text-primary">
                    <span>Learn more</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="https://support.apple.com/en-us/HT207937" target="_blank" rel="noopener noreferrer">
              <Card className="bg-card hover:shadow-lg transition-shadow h-full group">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Apple TV App Guide</h3>
                  <p className="text-muted-foreground mb-4">
                    Comprehensive guide to using the Apple TV app on your Mac, iPhone, iPad, and Apple TV.
                  </p>
                  <div className="flex items-center text-primary">
                    <span>Learn more</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="https://support.apple.com/en-us/HT202618" target="_blank" rel="noopener noreferrer">
              <Card className="bg-card hover:shadow-lg transition-shadow h-full group">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Home Sharing Setup</h3>
                  <p className="text-muted-foreground mb-4">
                    Step-by-step instructions for setting up Home Sharing between your Mac and Apple TV.
                  </p>
                  <div className="flex items-center text-primary">
                    <span>Learn more</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function SetupStep({
  number,
  title,
  description,
  icon
}: {
  number: number,
  title: string,
  description: string,
  icon: React.ReactNode
}) {
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
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
