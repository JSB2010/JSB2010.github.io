import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import {
  GraduationCap,
  Code,
  Cpu,
  Globe,
  Palette,
  Accessibility,
  Smartphone,
  Flame
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Me | Jacob Barkin",
  description: "Learn more about Jacob Barkin, my background, education, and skills in technology and financial education.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50 dark:from-background dark:to-background/80 z-10"></div>
        <div className="absolute inset-0 bg-[url('/images/mountains-bg.jpg')] bg-cover bg-center opacity-20 dark:opacity-10"></div>

        <div className="container relative z-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">About Me</h1>
            <div className="h-1 w-20 bg-primary rounded-full mx-auto mb-8"></div>
            <p className="text-xl text-muted-foreground mb-8">
              I'm Jacob Barkin, a student developer passionate about technology, financial education, and making a positive impact through accessible solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square max-w-md mx-auto md:mx-0 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/Jacob City.png"
                alt="Jacob Barkin"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay"></div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">My Journey</h2>
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
      <section className="py-16 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Education</h2>

          <div className="max-w-3xl mx-auto">
            <div className="relative pl-8 pb-12 border-l-2 border-primary/30 last:border-0">
              <div className="absolute top-0 left-0 w-8 h-8 -translate-x-1/2 rounded-full bg-primary flex items-center justify-center">
                <GraduationCap className="h-4 w-4 text-primary-foreground" />
              </div>

              <div className="bg-card rounded-xl p-6 shadow-md">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Kent Denver School</h3>
                  <span className="text-muted-foreground">2024 - 2028</span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-md p-1 flex items-center justify-center">
                    <GraduationCap className="h-8 w-8 text-primary" />
                  </div>
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
                  <Globe className="h-4 w-4 mr-2" />
                  Visit School Website
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-4">My Skills</h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            I've developed a diverse set of skills across various technologies and disciplines.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <SkillCard
              icon={<Code />}
              title="HTML5"
              level={90}
            />
            <SkillCard
              icon={<Palette />}
              title="CSS3"
              level={85}
            />
            <SkillCard
              icon={<Cpu />}
              title="JavaScript"
              level={80}
            />
            <SkillCard
              icon={<Code />}
              title="Python"
              level={75}
            />
            <SkillCard
              icon={<Flame />}
              title="Firebase"
              level={70}
            />
            <SkillCard
              icon={<Accessibility />}
              title="Accessibility"
              level={85}
            />
            <SkillCard
              icon={<Smartphone />}
              title="Responsive Design"
              level={90}
            />
            <SkillCard
              icon={<GraduationCap />}
              title="Education"
              level={95}
            />
          </div>
        </div>
      </section>
    </>
  );
}

function SkillCard({ icon, title, level }: { icon: React.ReactNode, title: string, level: number }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-md bg-primary/10 text-primary">
            {icon}
          </div>
          <h3 className="font-medium">{title}</h3>
        </div>

        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${level}%` }}
          ></div>
        </div>
        <div className="mt-2 text-right text-sm text-muted-foreground">
          {level}%
        </div>
      </CardContent>
    </Card>
  );
}
