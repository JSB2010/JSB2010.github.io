"use client";

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Send, ExternalLink, Mail } from 'lucide-react';

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(2, { message: "Subject must be at least 2 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

// Form values type
type FormValues = z.infer<typeof formSchema>;

export function ContactFormFixed() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  // Watch form values for generating the redirect URL
  const name = watch('name');
  const email = watch('email');
  const subject = watch('subject');
  const message = watch('message');

  // Generate the redirect URL with form data as query parameters
  const generateRedirectUrl = (data: FormValues) => {
    const params = new URLSearchParams();
    params.append('name', data.name);
    params.append('email', data.email);
    params.append('subject', data.subject || 'Contact Form Submission');
    params.append('message', data.message);

    return `/contact-submit.html?${params.toString()}`;
  };

  // Main form submission handler
  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);

    // Open the submission page in a new tab
    window.open(generateRedirectUrl(data), '_blank');

    // Reset submission state after a short delay
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1000);
  };

  // Direct email link component as a fallback
  const DirectEmailLink = () => {
    // Generate mailto link
    const generateMailtoLink = () => {
      if (!name || !email) return 'mailto:Jacobsamuelbarkin@gmail.com';

      const mailtoSubject = encodeURIComponent(subject || 'Contact Form');
      const mailtoBody = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message || ''}`
      );
      return `mailto:Jacobsamuelbarkin@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
    };

    return (
      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
          Send Message Directly via Email
        </h3>
        <p className="text-sm text-blue-700 dark:text-blue-400 mb-3">
          If you prefer, you can also send me an email directly:
        </p>
        <a
          href={generateMailtoLink()}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-blue-100 dark:bg-blue-800/50 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-700/50 transition-colors"
        >
          <Mail className="mr-2 h-4 w-4" />
          Email Me Directly
        </a>
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md mb-4">
        <p className="text-sm text-blue-700 dark:text-blue-400">
          This form will open a new tab to securely submit your message directly to my database.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="name"
              placeholder="Your name"
              {...register("name")}
              className={errors.name ? "border-red-300 dark:border-red-700" : ""}
            />
            {errors.name && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Your email address"
              {...register("email")}
              className={errors.email ? "border-red-300 dark:border-red-700" : ""}
            />
            {errors.email && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="subject" className="text-sm font-medium">
            Subject
          </label>
          <Input
            id="subject"
            placeholder="Message subject"
            {...register("subject")}
            className={errors.subject ? "border-red-300 dark:border-red-700" : ""}
          />
          {errors.subject && (
            <p className="text-red-500 dark:text-red-400 text-xs mt-1">
              {errors.subject.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium">
            Message
          </label>
          <Textarea
            id="message"
            placeholder="Your message"
            rows={6}
            {...register("message")}
            className={errors.message ? "border-red-300 dark:border-red-700" : ""}
          />
          {errors.message && (
            <p className="text-red-500 dark:text-red-400 text-xs mt-1">
              {errors.message.message}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="submit"
            className="w-full sm:w-auto h-9 sm:h-10 text-sm"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                Opening Submission Page...
              </>
            ) : (
              <>
                <ExternalLink className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Submit in New Tab
              </>
            )}
          </Button>
        </div>

        {/* Always show the direct email link as a fallback option */}
        <DirectEmailLink />
      </form>
    </div>
  );
}
