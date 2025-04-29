import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Laptop, 
  Download, 
  FileCode, 
  Terminal,
  HardDrive,
  Cpu,
  AlertCircle
} from "lucide-react";

export const metadata: Metadata = {
  title: "MacBook Pro OpenCore Guide | Jacob Barkin",
  description: "A comprehensive guide for installing macOS on older MacBook Pro models using OpenCore bootloader.",
};

export default function MacbookProOpencorePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50 dark:from-background dark:to-background/80 z-10"></div>
        <div className="absolute inset-0 bg-[url('/images/mountains-bg.jpg')] bg-cover bg-center opacity-20 dark:opacity-10"></div>
        
        <div className="container relative z-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">MacBook Pro OpenCore Guide</h1>
            <div className="h-1 w-20 bg-primary rounded-full mx-auto mb-8"></div>
            <p className="text-xl text-muted-foreground">
              A comprehensive guide for installing macOS on older MacBook Pro models using the OpenCore bootloader.
            </p>
          </div>
        </div>
      </section>
      
      {/* Introduction Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">What is OpenCore?</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  OpenCore is an open-source bootloader designed to work with macOS, providing a clean, modern approach to booting macOS on both Apple and non-Apple hardware.
                </p>
                <p>
                  Unlike older bootloaders, OpenCore focuses on security, stability, and proper implementation of Apple's boot process. It allows for a more native experience and better compatibility with macOS updates.
                </p>
                <p>
                  This guide specifically focuses on using OpenCore to install and run modern versions of macOS on older MacBook Pro models that are no longer officially supported by Apple.
                </p>
              </div>
              
              <div className="mt-8">
                <Button asChild>
                  <Link href="#download-section">
                    <Download className="mr-2 h-5 w-5" />
                    Download Configuration Files
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
      
      {/* Compatibility Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Supported MacBook Pro Models</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4">
                    <Laptop className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">MacBook Pro (Mid 2012)</h3>
                  <p className="text-muted-foreground">
                    13-inch and 15-inch models with Intel Ivy Bridge processors. Can run up to macOS Monterey with OpenCore.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4">
                    <Laptop className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">MacBook Pro (Late 2011)</h3>
                  <p className="text-muted-foreground">
                    13-inch, 15-inch, and 17-inch models with Intel Sandy Bridge processors. Can run up to macOS Big Sur with OpenCore.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4">
                    <Laptop className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">MacBook Pro (Mid 2010)</h3>
                  <p className="text-muted-foreground">
                    13-inch, 15-inch, and 17-inch models with Intel Arrandale processors. Can run up to macOS Catalina with OpenCore.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Installation Steps */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12">Installation Guide</h2>
          
          <div className="space-y-12">
            <InstallationStep 
              number={1}
              title="Prepare Your MacBook Pro"
              description="Back up all your important data before proceeding. This process will erase your drive and install a fresh copy of macOS."
              icon={<HardDrive />}
            />
            
            <InstallationStep 
              number={2}
              title="Download OpenCore and Configuration Files"
              description="Download the latest version of OpenCore and the pre-configured EFI files for your specific MacBook Pro model."
              icon={<Download />}
            />
            
            <InstallationStep 
              number={3}
              title="Create a Bootable macOS Installer"
              description="Use the 'createinstallmedia' command in Terminal to create a bootable USB installer with your desired macOS version."
              icon={<Terminal />}
            />
            
            <InstallationStep 
              number={4}
              title="Configure OpenCore for Your Model"
              description="Modify the config.plist file to match your specific MacBook Pro model and hardware configuration."
              icon={<FileCode />}
            />
            
            <InstallationStep 
              number={5}
              title="Install macOS"
              description="Boot from the USB installer using OpenCore and follow the on-screen instructions to install macOS on your MacBook Pro."
              icon={<Laptop />}
            />
            
            <InstallationStep 
              number={6}
              title="Post-Installation"
              description="Install additional kexts and patches as needed to enable all hardware features like Wi-Fi, Bluetooth, and graphics acceleration."
              icon={<Cpu />}
            />
          </div>
        </div>
      </section>
      
      {/* Download Section */}
      <section id="download-section" className="py-16 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Download Configuration Files</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4">
                    <Download className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">MacBook Pro (2010-2012) EFI</h3>
                  <p className="text-muted-foreground mb-6">
                    Pre-configured OpenCore EFI files for MacBook Pro models from 2010 to 2012.
                  </p>
                  <Button>Download EFI Files</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4">
                    <FileCode className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Configuration Guide</h3>
                  <p className="text-muted-foreground mb-6">
                    Detailed PDF guide with step-by-step instructions for configuring OpenCore for your specific model.
                  </p>
                  <Button>Download Guide</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Warning Section */}
      <section className="py-16">
        <div className="container">
          <div className="bg-card rounded-xl p-8 shadow-md border-l-4 border-yellow-500">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-full bg-yellow-500/10 text-yellow-500">
                <AlertCircle className="h-6 w-6" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-4">Important Disclaimer</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    This guide is provided for educational purposes only. Installing macOS on unsupported hardware may violate Apple's End User License Agreement (EULA).
                  </p>
                  <p>
                    I am not responsible for any damage that may occur to your hardware or data during this process. Always back up your important files before proceeding.
                  </p>
                  <p>
                    Some features may not work perfectly on unsupported hardware, and you may experience issues with certain applications or system updates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function InstallationStep({ 
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
        {number < 6 && (
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
