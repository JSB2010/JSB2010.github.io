import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
// Import actual programming language and technology icons
import {
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiPython,
  SiFirebase,
  SiReact
} from "react-icons/si";

// Import additional icon sets for technologies that might not be in simple-icons
import { FaUniversalAccess, FaMobileAlt, FaGraduationCap, FaGlobeAmericas } from "react-icons/fa";

// Import Aceternity UI components
import { BackgroundGradient } from "@/components/ui/aceternity/background-gradient";
import { MovingBorder } from "@/components/ui/aceternity/moving-border";
import { Spotlight } from "@/components/ui/aceternity/spotlight";
import { TextRevealCard } from "@/components/ui/aceternity/text-reveal-card";
import { ThreeDCard } from "@/components/ui/aceternity/3d-card";

export const metadata: Metadata = {
  title: "About Me | Jacob Barkin",
  description: "Learn more about Jacob Barkin, my background, education, and skills in technology and financial education.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50 dark:from-background dark:to-background/80 z-10"></div>
        <div className="absolute inset-0 bg-[url('/images/mountains-bg.jpg')] bg-cover bg-center opacity-20 dark:opacity-10"></div>
        <div className="container relative z-20">
          <div className="max-w-3xl mx-auto text-center">
            <TextRevealCard
              text="About Me"
              revealText="Jacob Barkin"
              className="border-none shadow-none p-0 bg-transparent"
            >
              <div className="h-1 w-20 bg-primary rounded-full mx-auto my-8"></div>
            </TextRevealCard>
            <p className="text-xl text-muted-foreground mb-8">
              I'm Jacob Barkin, a student developer passionate about technology, financial education, and making a positive impact through accessible solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-16 relative overflow-hidden">
        <Spotlight className="hidden md:block" />
        <div className="container relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <ThreeDCard
              className="relative aspect-square max-w-md mx-auto md:mx-0 rounded-2xl overflow-hidden"
              rotationIntensity={10}
              glareOpacity={0.2}
              glareSize={0.6}
            >
              <BackgroundGradient className="rounded-2xl h-full">
                <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="/images/jacob-profile.png"
                    alt="Jacob Barkin"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay"></div>
                </div>
              </BackgroundGradient>
            </ThreeDCard>

            <div>
              <TextRevealCard
                text="My Journey"
                revealText="About Me"
                className="border-none shadow-none p-0 bg-transparent mb-6"
              />
              <div className="space-y-4 text-muted-foreground">
                <p>
                  I'm a freshman at Kent Denver School with a focus on computer science, technology, and financial education. My passion for technology began at an early age, and I've been developing my skills in programming and web development ever since.
                </p>
                <p>
                  Beyond technology, I'm deeply committed to financial education for youth. I believe that understanding personal finance is a critical life skill that should be accessible to everyone, especially young people who are just beginning to navigate the financial world.
                </p>
                <p>
                  I'm also interested in public transportation systems and their impact on communities. I research and advocate for improved public transit, focusing on accessibility and sustainability.
                </p>
                <p>
                  Through my projects and initiatives, I aim to combine these interests to create meaningful solutions that help people learn, grow, and navigate the world more effectively.
                </p>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Education Section */}
      <section className="py-16 bg-muted/50 relative overflow-hidden">
        <div className="container relative z-10">
          <TextRevealCard
            text="Education"
            revealText="My Learning Path"
            className="border-none shadow-none p-0 bg-transparent mb-12 mx-auto text-center"
          />

          <div className="max-w-3xl mx-auto">
            <div className="relative pl-8 pb-12 border-l-2 border-primary/30 last:border-0">
              <MovingBorder className="p-0.5" containerClassName="absolute top-0 left-0 -translate-x-1/2 rounded-full" duration={5000}>
                <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center">
                  <FaGraduationCap className="h-4 w-4 text-primary" />
                </div>
              </MovingBorder>

              <BackgroundGradient className="rounded-xl">
                <Card className="border-0 bg-background/80 backdrop-blur-sm p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">Kent Denver School</h3>
                    <span className="text-muted-foreground">2024 - 2028</span>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <MovingBorder className="p-0.5" containerClassName="rounded-md" duration={5000}>
                      <div className="w-12 h-12 bg-background rounded-md p-1 flex items-center justify-center">
                        <FaGraduationCap className="h-8 w-8 text-primary" />
                      </div>
                    </MovingBorder>
                    <div>
                      <p className="font-medium">Freshman</p>
                      <p className="text-sm text-muted-foreground">Focus on Computer Science & Technology</p>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4">
                    Actively involved in technology clubs and programming initiatives. Pursuing coursework in computer science, mathematics, and financial literacy.
                  </p>

                  <Link
                    href="https://www.kentdenver.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:underline"
                  >
                    <FaGlobeAmericas className="h-4 w-4 mr-2" />
                    Visit School Website
                  </Link>
                </Card>
              </BackgroundGradient>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 relative overflow-hidden">
        <Spotlight className="hidden md:block" />

        <div className="container relative z-10">
          <TextRevealCard
            text="My Skills"
            revealText="Technologies & Expertise"
            className="border-none shadow-none p-0 bg-transparent mb-4 mx-auto text-center"
          />
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            I've developed a diverse set of skills across various technologies and disciplines.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <ThreeDCard
              className="h-full w-full"
              rotationIntensity={5}
              glareOpacity={0.1}
              glareSize={0.4}
            >
              <SkillCard
                icon={<SiHtml5 className="h-6 w-6" />}
                title="HTML5"
                level={90}
              />
            </ThreeDCard>

            <ThreeDCard
              className="h-full w-full"
              rotationIntensity={5}
              glareOpacity={0.1}
              glareSize={0.4}
            >
              <SkillCard
                icon={<SiCss3 className="h-6 w-6" />}
                title="CSS3"
                level={85}
              />
            </ThreeDCard>

            <ThreeDCard
              className="h-full w-full"
              rotationIntensity={5}
              glareOpacity={0.1}
              glareSize={0.4}
            >
              <SkillCard
                icon={<SiJavascript className="h-6 w-6" />}
                title="JavaScript"
                level={80}
              />
            </ThreeDCard>

            <ThreeDCard
              className="h-full w-full"
              rotationIntensity={5}
              glareOpacity={0.1}
              glareSize={0.4}
            >
              <SkillCard
                icon={<SiPython className="h-6 w-6" />}
                title="Python"
                level={75}
              />
            </ThreeDCard>

            <ThreeDCard
              className="h-full w-full"
              rotationIntensity={5}
              glareOpacity={0.1}
              glareSize={0.4}
            >
              <SkillCard
                icon={<SiFirebase className="h-6 w-6" />}
                title="Firebase"
                level={70}
              />
            </ThreeDCard>

            <ThreeDCard
              className="h-full w-full"
              rotationIntensity={5}
              glareOpacity={0.1}
              glareSize={0.4}
            >
              <SkillCard
                icon={<SiReact className="h-6 w-6" />}
                title="React"
                level={85}
              />
            </ThreeDCard>

            <ThreeDCard
              className="h-full w-full"
              rotationIntensity={5}
              glareOpacity={0.1}
              glareSize={0.4}
            >
              <SkillCard
                icon={<FaUniversalAccess className="h-6 w-6" />}
                title="Accessibility"
                level={85}
              />
            </ThreeDCard>

            <ThreeDCard
              className="h-full w-full"
              rotationIntensity={5}
              glareOpacity={0.1}
              glareSize={0.4}
            >
              <SkillCard
                icon={<FaMobileAlt className="h-6 w-6" />}
                title="Responsive Design"
                level={90}
              />
            </ThreeDCard>

            <ThreeDCard
              className="h-full w-full"
              rotationIntensity={5}
              glareOpacity={0.1}
              glareSize={0.4}
            >
              <SkillCard
                icon={<FaGraduationCap className="h-6 w-6" />}
                title="Education"
                level={95}
              />
            </ThreeDCard>
          </div>
        </div>
      </section>
    </>
  );
}

function SkillCard({ icon, title, level }: Readonly<{ icon: React.ReactNode, title: string, level: number }>) {
  return (
    <BackgroundGradient className="rounded-xl h-full">
      <Card className="overflow-hidden border-0 bg-background/80 backdrop-blur-sm h-full">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <MovingBorder className="p-0.5" containerClassName="rounded-md" duration={5000}>
              <div className="p-2 rounded-md bg-background text-primary">
                {icon}
              </div>
            </MovingBorder>
            <h3 className="font-medium">{title}</h3>
          </div>

          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 ease-out skill-progress-${level}`}
            ></div>
          </div>
          <div className="mt-2 text-right text-sm text-muted-foreground">
            {level}%
          </div>
        </CardContent>
      </Card>
    </BackgroundGradient>
  );
}
