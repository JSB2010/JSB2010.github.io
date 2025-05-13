import { Metadata } from "next";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
// Import actual programming language and technology icons
import {
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiPython,
  SiAppwrite,
  SiReact,
  SiFirebase,
  SiOpenai,
  SiNextdotjs,
  SiTailwindcss,
  SiTypescript
} from "react-icons/si";

// Import additional icon sets for technologies that might not be in simple-icons
import { FaUniversalAccess, FaGraduationCap, FaGlobeAmericas, FaBriefcase, FaUsers } from "react-icons/fa";

// Import Aceternity UI components
import { BackgroundGradient } from "@/components/ui/aceternity/background-gradient";
import { MovingBorder } from "@/components/ui/aceternity/moving-border";
import { Spotlight } from "@/components/ui/aceternity/spotlight";
import { TextRevealCard } from "@/components/ui/aceternity/text-reveal-card";
import { ThreeDCard } from "@/components/ui/aceternity/3d-card";
import { GradientSkillsContainer } from "@/components/ui/aceternity/gradient-skills-container";
import { PageHero } from "@/components/ui/page-hero";
import { LazyLoad } from "@/components/ui/lazy-load";

// Import Education Section component
import { EducationSection } from "@/components/education/education-section";

export const metadata: Metadata = {
  title: "About Me | Jacob Barkin",
  description: "Learn more about Jacob Barkin, my background, education, and skills in technology and financial education.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <PageHero
        title="About Me"
        description="I'm Jacob Barkin, a student developer passionate about technology, financial education, and making a positive impact through accessible solutions."
        backgroundImage="/images/mountains-bg.jpg"
        tags={["Developer", "Student", "Financial Education", "Accessibility"]}
      />

      {/* Bio Section */}
      <section className="py-10 sm:py-12 md:py-16 relative overflow-hidden">
        <Spotlight className="hidden md:block" />
        <div className="container relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="relative aspect-square max-w-xs sm:max-w-sm md:max-w-md mx-auto md:mx-0 rounded-2xl overflow-hidden">
              <BackgroundGradient className="rounded-2xl h-full">
                <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-xl flex items-center justify-center">
                  <img
                    src="/images/Jacob City.png"
                    alt="Jacob Barkin"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay"></div>
                </div>
              </BackgroundGradient>
            </div>

            <div className="px-4 sm:px-6 md:px-0 mt-6 md:mt-0">
              <TextRevealCard
                text="My Journey"
                revealText="About Me"
                className="border-none shadow-none p-0 bg-transparent mb-4 sm:mb-6"
              />
              <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-muted-foreground">
                <p>
                  I&apos;m a freshman at Kent Denver School with a focus on computer science, technology, and financial education. My passion for technology began at an early age, and I&apos;ve been developing my skills in programming and web development ever since.
                </p>
                <p>
                  Beyond technology, I&apos;m deeply committed to financial education and literacy for youth. As a Youth Advisory Board Member at Young Americans Center For Financial Education, I work to promote financial literacy and help young people develop essential money management skills. I believe that understanding personal finance is a critical life skill that should be accessible to everyone, especially young people who are just beginning to navigate the financial world.
                </p>
                <p>
                  I&apos;m also interested in public transportation systems and their impact on communities. I research and advocate for improved public transit, focusing on accessibility and sustainability.
                </p>
                <p>
                  Through my projects and initiatives, I aim to combine these interests to create meaningful solutions that help people learn, grow, and navigate both the technological and financial aspects of the modern world more effectively.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Education Section - Lazy loaded */}
      <LazyLoad className="bg-muted/50 relative overflow-hidden">
        <section className="py-10 sm:py-12 md:py-16">
          <div className="container relative z-10 px-4 sm:px-6">
            <div className="flex flex-col items-center mb-8 sm:mb-10">
              <TextRevealCard
                text="Education"
                revealText="My Learning Path"
                className="border-none shadow-none p-0 bg-transparent mx-auto text-center"
              />
              <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mx-auto mt-3 sm:mt-4 mb-4"></div>

              <div className="flex items-center justify-center bg-muted/30 backdrop-blur-sm rounded-full px-4 py-2 border border-border/50">
                <FaGraduationCap className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary" />
                <span className="text-sm sm:text-base font-medium">Kent Denver School</span>
                <span className="mx-2 text-muted-foreground">•</span>
                <span className="text-xs sm:text-sm text-muted-foreground">High School</span>
                <span className="mx-2 text-muted-foreground">•</span>
                <span className="text-xs sm:text-sm text-muted-foreground">2024-2028</span>
                <a
                  href="https://kentdenver.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-primary hover:text-primary/80 transition-colors"
                  aria-label="Visit Kent Denver School website"
                >
                  <FaGlobeAmericas className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </a>
              </div>
            </div>

            {/* Education Section component */}
            <div className="max-w-3xl mx-auto">
              <EducationSection />
            </div>
          </div>
        </section>
      </LazyLoad>

      {/* Work Experience Section - Lazy loaded */}
      <LazyLoad className="relative overflow-hidden">
        <section className="py-10 sm:py-12 md:py-16">
          <div className="container relative z-10 px-4 sm:px-6">
            <TextRevealCard
              text="Work Experience"
              revealText="Professional Journey"
              className="border-none shadow-none p-0 bg-transparent mb-8 sm:mb-10 md:mb-12 mx-auto text-center"
            />

            <div className="max-w-3xl mx-auto">
              <div className="relative pl-6 sm:pl-8 pb-8 sm:pb-12 border-l-2 border-primary/30 last:border-0">
                <MovingBorder className="p-0.5" containerClassName="absolute top-0 left-0 -translate-x-1/2 rounded-full" duration={5000}>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-background flex items-center justify-center">
                    <FaBriefcase className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                  </div>
                </MovingBorder>

                <BackgroundGradient className="rounded-xl">
                  <Card className="border-0 bg-background/80 backdrop-blur-sm p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4">
                      <h3 className="text-lg sm:text-xl font-semibold">Young Americans Center For Financial Education</h3>
                      <span className="text-sm text-muted-foreground mt-1 sm:mt-0">2024 - Present</span>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <MovingBorder className="p-0.5" containerClassName="rounded-md" duration={5000}>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-background rounded-md p-1 flex items-center justify-center">
                          <FaUsers className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                        </div>
                      </MovingBorder>
                      <div>
                        <p className="font-medium text-sm sm:text-base">Youth Advisory Board Member</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Financial Education & Leadership</p>
                      </div>
                    </div>

                    <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                      As a member of the Youth Advisory Board, I provide insights and perspectives on banking products, services, and programs designed for young people. I collaborate with a diverse group of students from across Colorado to advise Young Americans Bank and the nonprofit programs of Young Americans Center for Financial Education. This role has allowed me to develop skills in leadership, business etiquette, and financial literacy while serving as an ambassador for the organization at special events and functions.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <a
                        href="https://yacenter.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-primary hover:underline text-sm sm:text-base"
                      >
                        <FaGlobeAmericas className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                        Visit Organization Website
                      </a>

                      <a
                        href="https://yacenter.org/about-us/youth-board/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-primary hover:underline text-sm sm:text-base"
                      >
                        <FaUsers className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                        Learn About the Youth Board
                      </a>
                    </div>
                  </Card>
                </BackgroundGradient>
              </div>
            </div>
          </div>
        </section>
      </LazyLoad>

      {/* Skills Section - Lazy loaded */}
      <LazyLoad className="relative overflow-hidden">
        <section className="py-10 sm:py-12 md:py-16">
          <Spotlight className="hidden md:block" />

          <div className="container relative z-10 px-4 sm:px-6">
            <TextRevealCard
              text="My Skills"
              revealText="Technologies & Expertise"
              className="border-none shadow-none p-0 bg-transparent mb-3 sm:mb-4 mx-auto text-center"
            />
            <p className="text-center text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10 md:mb-12">
              I&apos;ve developed a diverse set of skills across various technologies and disciplines.
            </p>

            <GradientSkillsContainer columns={4} rows={3}>
              <ThreeDCard
                className="h-full w-full"
                rotationIntensity={5}
                glareOpacity={0.1}
                glareSize={0.4}
              >
                <SkillCard
                  icon={<SiHtml5 className="h-6 w-6" />}
                  title="HTML5"
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
                />
              </ThreeDCard>

              <ThreeDCard
                className="h-full w-full"
                rotationIntensity={5}
                glareOpacity={0.1}
                glareSize={0.4}
              >
                <SkillCard
                  icon={<SiTypescript className="h-6 w-6" />}
                  title="TypeScript"
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
                />
              </ThreeDCard>

              <ThreeDCard
                className="h-full w-full"
                rotationIntensity={5}
                glareOpacity={0.1}
                glareSize={0.4}
              >
                <SkillCard
                  icon={<SiNextdotjs className="h-6 w-6" />}
                  title="Next.js"
                />
              </ThreeDCard>

              <ThreeDCard
                className="h-full w-full"
                rotationIntensity={5}
                glareOpacity={0.1}
                glareSize={0.4}
              >
                <SkillCard
                  icon={<SiTailwindcss className="h-6 w-6" />}
                  title="Tailwind CSS"
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
                />
              </ThreeDCard>

              <ThreeDCard
                className="h-full w-full"
                rotationIntensity={5}
                glareOpacity={0.1}
                glareSize={0.4}
              >
                <SkillCard
                  icon={<SiAppwrite className="h-6 w-6" />}
                  title="Appwrite"
                />
              </ThreeDCard>

              <ThreeDCard
                className="h-full w-full"
                rotationIntensity={5}
                glareOpacity={0.1}
                glareSize={0.4}
              >
                <SkillCard
                  icon={<SiOpenai className="h-6 w-6" />}
                  title="AI Integration"
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
                />
              </ThreeDCard>
            </GradientSkillsContainer>
          </div>
        </section>
      </LazyLoad>
    </>
  );
}

function SkillCard({
  icon,
  title,
  gradientPosition,
}: Readonly<{
  icon: React.ReactNode,
  title: string,
  gradientPosition?: { x: number, y: number },
}>) {
  return (
    <div className="group h-full perspective-[1000px] transform-gpu transition-all duration-300 hover:scale-[1.03]">
      <BackgroundGradient
        className="rounded-xl h-full"
        gradientPosition={gradientPosition}
        useGlobalGradient={true}
      >
        <Card className="overflow-hidden border-0 bg-background/80 backdrop-blur-sm h-full relative group-hover:shadow-xl transition-all duration-300">
          {/* Glass morphism effect */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Noise texture overlay */}
          <div className="absolute inset-0 rounded-xl mix-blend-overlay pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 skill-card-noise"></div>

          <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center relative z-10">
            <MovingBorder
              className="p-0.5 mb-4 transition-all duration-300 group-hover:p-1"
              containerClassName="rounded-full shadow-md"
              duration={4000}
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-background text-primary flex items-center justify-center relative overflow-hidden group-hover:bg-background/90 transition-all duration-300">
                {/* Particle effect container */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute top-0 left-1/2 w-1 h-1 rounded-full bg-primary/40 animate-float-slow"></div>
                  <div className="absolute bottom-1/4 left-1/4 w-1 h-1 rounded-full bg-primary/40 animate-float-medium"></div>
                  <div className="absolute top-1/3 right-1/4 w-1 h-1 rounded-full bg-primary/40 animate-float-fast"></div>
                </div>

                <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 relative z-10">
                  {icon}
                </div>
              </div>
            </MovingBorder>

            <h3 className="text-base sm:text-lg md:text-xl font-medium mb-2 transition-all duration-300 group-hover:tracking-wide">
              {title}
            </h3>

            <div className="w-16 h-1 bg-primary/30 rounded-full mx-auto group-hover:w-20 group-hover:bg-primary/50 transition-all duration-300"></div>
          </CardContent>
        </Card>
      </BackgroundGradient>
    </div>
  );
}
