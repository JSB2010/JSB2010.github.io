import { render, screen } from '@testing-library/react';
import Footer from '@/components/footer';
import '@testing-library/jest-dom';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img alt={props.alt} {...props} />;
  },
}));

// Mock react-icons
jest.mock('react-icons/fa', () => ({
  FaGithub: () => <div data-testid="github-icon" />,
  FaLinkedin: () => <div data-testid="linkedin-icon" />,
}));

// Mock useEffect for scroll listener
jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  return {
    ...originalReact,
    useEffect: jest.fn(f => f()),
  };
});

describe('Footer Component', () => {
  it('renders the logo and site name', () => {
    render(<Footer />);

    expect(screen.getByAltText('Jacob Barkin Logo')).toBeInTheDocument();
    expect(screen.getByText('Jacob Barkin')).toBeInTheDocument();
  });

  it('renders the site description', () => {
    render(<Footer />);

    expect(screen.getByText(/Developer, financial education advocate/)).toBeInTheDocument();
  });

  it('renders all navigation sections', () => {
    render(<Footer />);

    expect(screen.getByText('Explore')).toBeInTheDocument();
    expect(screen.getByText('Quick Links')).toBeInTheDocument();
    expect(screen.getByText('Connect')).toBeInTheDocument();
  });

  it('renders all primary navigation links', () => {
    render(<Footer />);

    // Use getAllByText for elements that might appear multiple times
    const projectLinks = screen.getAllByText('Projects');
    expect(projectLinks.length).toBeGreaterThan(0);

    expect(screen.getByText('About Me')).toBeInTheDocument();
    expect(screen.getByText('Research')).toBeInTheDocument();

    const contactLinks = screen.getAllByText('Contact');
    expect(contactLinks.length).toBeGreaterThan(0);

    // Quick Links section
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('renders social media links with correct attributes', () => {
    render(<Footer />);

    // GitHub link
    const githubLink = screen.getByLabelText('GitHub');
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/JSB2010');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');

    // LinkedIn link
    const linkedinLink = screen.getByLabelText('LinkedIn');
    expect(linkedinLink).toBeInTheDocument();
    expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/jacob-barkin/');
    expect(linkedinLink).toHaveAttribute('target', '_blank');
    expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');

    // Contact link
    const contactLink = screen.getByLabelText('Contact');
    expect(contactLink).toBeInTheDocument();
    expect(contactLink).toHaveAttribute('href', '/contact');
  });

  it('renders the build technology information', () => {
    render(<Footer />);

    expect(screen.getByText('Built with')).toBeInTheDocument();
    expect(screen.getByText('using Next.js & shadcn UI')).toBeInTheDocument();
  });

  it('does not render copyright text', () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear().toString();
    const copyrightText = new RegExp(`© ${currentYear} Jacob Barkin. All rights reserved.`);

    expect(screen.queryByText(copyrightText)).not.toBeInTheDocument();
  });

  it('does not show back to top button by default', () => {
    // Mock window.scrollY to be at the top
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });

    render(<Footer />);

    // The button should not be in the document when at the top
    const backToTopButton = screen.queryByLabelText('Back to top');
    expect(backToTopButton).not.toBeInTheDocument();
  });
});
