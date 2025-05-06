// src/components/ui/optimized-icons.tsx
'use client';

import React from 'react';

// Import specific icons individually instead of the entire react-icons library
// This helps to reduce bundle size significantly
import { FaGithub } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { FaLinkedin } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

// Dynamically import icons that are only used below the fold
import dynamic from 'next/dynamic';

// Icons that are not immediately visible can be loaded lazily
const FaCode = dynamic(() => import('react-icons/fa').then(mod => mod.FaCode), {
  ssr: false,
  loading: () => <span className="icon-placeholder"></span>
});

const FaLaptopCode = dynamic(() => import('react-icons/fa').then(mod => mod.FaLaptopCode), {
  ssr: false,
  loading: () => <span className="icon-placeholder"></span>
});

type SocialIconProps = {
  name: string;
  href: string;
  icon: React.ReactNode;
  label: string;
};

/**
 * Optimized social icons component that demonstrates best practices for
 * using React Icons in a performance-optimized way.
 */
export function OptimizedSocialIcons() {
  const socialLinks: SocialIconProps[] = [
    {
      name: 'GitHub',
      href: 'https://github.com/JSB2010',
      icon: <FaGithub className="h-5 w-5" />,
      label: 'GitHub Profile'
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com',
      icon: <FaXTwitter className="h-5 w-5" />,
      label: 'Twitter Profile'
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com',
      icon: <FaLinkedin className="h-5 w-5" />,
      label: 'LinkedIn Profile'
    },
    {
      name: 'Email',
      href: 'mailto:contact@example.com',
      icon: <MdEmail className="h-5 w-5" />,
      label: 'Send Email'
    }
  ];

  return (
    <div className="flex space-x-4">
      {socialLinks.map((social) => (
        <a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
          className="text-muted-foreground hover:text-primary transition-colors duration-200"
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
}

// Component that demonstrates lazy-loaded icons below the fold
export function OptimizedSkillIcons() {
  return (
    <div className="flex space-x-4 mt-8">
      <div className="flex items-center">
        <FaCode className="h-5 w-5 mr-2" />
        <span>Development</span>
      </div>
      <div className="flex items-center">
        <FaLaptopCode className="h-5 w-5 mr-2" />
        <span>Web Design</span>
      </div>
    </div>
  );
}

export default OptimizedSocialIcons;
