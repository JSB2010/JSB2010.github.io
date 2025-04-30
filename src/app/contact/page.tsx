import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mail, 
  MessageSquare, 
  Send,
  Github,
  Linkedin
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact | Jacob Barkin",
  description: "Get in touch with Jacob Barkin for collaboration, questions, or just to say hello.",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50 dark:from-background dark:to-background/80 z-10"></div>
        <div className="absolute inset-0 bg-[url('/images/mountains-bg.jpg')] bg-cover bg-center opacity-20 dark:opacity-10"></div>
        
        <div className="container relative z-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Get In Touch</h1>
            <div className="h-1 w-20 bg-primary rounded-full mx-auto mb-8"></div>
            <p className="text-xl text-muted-foreground">
              Have a question or want to collaborate? I'd love to hear from you!
            </p>
          </div>
        </div>
      </section>
      
      {/* Contact Form Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Send Me a Message</h2>
              <p className="text-muted-foreground mb-8">
                Fill out the form below and I'll get back to you as soon as possible. I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
              </p>
              
              <ContactForm />
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-6">Connect With Me</h2>
              <p className="text-muted-foreground mb-8">
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
                  icon={<Linkedin className="h-6 w-6" />}
                  title="LinkedIn"
                  description="Connect with me professionally and stay updated on my career journey."
                  actionText="Connect on LinkedIn"
                  actionLink="https://www.linkedin.com/in/jacob-barkin/"
                  gradient="from-blue-600 to-blue-800"
                />
                
                <ContactCard 
                  icon={<Github className="h-6 w-6" />}
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
      
      {/* FAQ Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2">Are you available for freelance work?</h3>
                <p className="text-muted-foreground">
                  Yes, I'm open to freelance opportunities, particularly in web development, accessibility consulting, and educational technology.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2">Do you offer mentorship?</h3>
                <p className="text-muted-foreground">
                  I occasionally mentor students interested in technology and financial education. Feel free to reach out with specific questions or areas you'd like guidance in.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2">How can I support your financial education initiatives?</h3>
                <p className="text-muted-foreground">
                  You can support by sharing resources, volunteering expertise, or collaborating on educational content. Contact me for specific ways to get involved.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2">What's the best way to contact you?</h3>
                <p className="text-muted-foreground">
                  The contact form on this page is the most direct way to reach me. For professional connections, LinkedIn is also a good option.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactForm() {
  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <Input id="name" placeholder="Your name" required />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input id="email" type="email" placeholder="Your email" required />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="subject" className="text-sm font-medium">
          Subject
        </label>
        <Input id="subject" placeholder="What's this about?" required />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <Textarea 
          id="message" 
          placeholder="Your message..." 
          rows={6}
          required 
        />
      </div>
      
      <Button type="submit" className="w-full sm:w-auto">
        <Send className="mr-2 h-4 w-4" />
        Send Message
      </Button>
    </form>
  );
}

function ContactCard({ 
  icon, 
  title, 
  description, 
  actionText, 
  actionLink,
  gradient
}: { 
  icon: React.ReactNode, 
  title: string, 
  description: string, 
  actionText: string, 
  actionLink: string,
  gradient: string
}) {
  return (
    <Card className="overflow-hidden">
      <div className={`h-2 bg-gradient-to-r ${gradient}`}></div>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            {icon}
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
            
            <Button asChild variant="outline" size="sm">
              <Link href={actionLink} target={actionLink.startsWith('http') ? "_blank" : undefined} rel={actionLink.startsWith('http') ? "noopener noreferrer" : undefined}>
                {actionText}
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
