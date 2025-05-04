import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContactFormCloudflare } from "@/components/contact/contact-form-cloudflare";
import { Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export const metadata: Metadata = {
  title: "Contact | Jacob Barkin",
  description: "Get in touch with Jacob Barkin for collaboration, questions, or just to say hello.",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50 dark:from-background dark:to-background/80 z-10"></div>
        <div className="absolute inset-0 bg-[url('/images/mountains-bg.jpg')] bg-cover bg-center opacity-20 dark:opacity-10"></div>

        <div className="container relative z-20 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 sm:mb-6">Get In Touch</h1>
            <div className="h-1 w-16 sm:w-20 bg-primary rounded-full mx-auto mb-4 sm:mb-6 md:mb-8"></div>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
              Have a question or want to collaborate? I'd love to hear from you!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-10 sm:py-12 md:py-16">
        <div className="container px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-6">Send Me a Message</h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
                Fill out the form below and I'll get back to you as soon as possible. I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
              </p>

              <ContactFormCloudflare />
            </div>

            <div className="mt-8 lg:mt-0">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-6">Connect With Me</h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
                You can also reach out to me through these platforms or follow my work.
              </p>

              <div className="grid grid-cols-1 gap-6">
                <ContactCard
                  icon={<Mail className="h-6 w-6" />}
                  title="Email"
                  description="Send me an email directly for any inquiries or collaboration opportunities."
                  actionText="Email Me"
                  actionLink="mailto:Jacobsamuelbarkin@gmail.com"
                  gradient="from-blue-500 to-cyan-500"
                />

                <ContactCard
                  icon={<FaLinkedin className="h-6 w-6" />}
                  title="LinkedIn"
                  description="Connect with me professionally and stay updated on my career journey."
                  actionText="Connect on LinkedIn"
                  actionLink="https://www.linkedin.com/in/jacob-barkin/"
                  gradient="from-blue-600 to-blue-800"
                />

                <ContactCard
                  icon={<FaGithub className="h-6 w-6" />}
                  title="GitHub"
                  description="Check out my code repositories and development projects."
                  actionText="Follow on GitHub"
                  actionLink="https://github.com/JSB2010"
                  gradient="from-gray-700 to-gray-900"
                />
              </div>
            </div>
          </div>
        </div>
      </section>


    </>
  );
}



function ContactCard({
  icon,
  title,
  description,
  actionText,
  actionLink,
  gradient
}: Readonly<{
  icon: React.ReactNode,
  title: string,
  description: string,
  actionText: string,
  actionLink: string,
  gradient: string
}>) {
  return (
    <Card className="overflow-hidden">
      <div className={`h-1.5 sm:h-2 bg-gradient-to-r ${gradient}`}></div>
      <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 rounded-full bg-primary/10 text-primary">
            {icon}
          </div>

          <div className="flex-1">
            <h3 className="text-sm sm:text-base font-semibold mb-0.5 sm:mb-1">{title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">{description}</p>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-8 sm:h-9 text-xs sm:text-sm"
            >
              <Link
                href={actionLink}
                target={actionLink.startsWith('http') ? "_blank" : undefined}
                rel={actionLink.startsWith('http') ? "noopener noreferrer" : undefined}
              >
                {actionText}
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
