import { render, screen } from '@testing-library/react';
import Footer from '@/components/footer';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    return <img alt={props.alt} {...props} />;
  },
}));

// Mock the current year for consistent testing
const mockDate = new Date('2025-01-01');
const originalDate = global.Date;

describe('Footer Component', () => {
  beforeAll(() => {
    // Mock the Date constructor to return a consistent date
    global.Date = class extends Date {
      constructor() {
        super();
        return mockDate;
      }
    };
  });

  afterAll(() => {
    // Restore the original Date constructor
    global.Date = originalDate;
  });

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
    
    // Explore section links
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('About Me')).toBeInTheDocument();
    expect(screen.getByText('Research')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    
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

  it('renders the current year in the copyright text', () => {
    render(<Footer />);
    
    // The mocked date year is 2025
    expect(screen.getByText(/© 2025 Jacob Barkin. All rights reserved./)).toBeInTheDocument();
  });

  it('renders the build technology information', () => {
    render(<Footer />);
    
    expect(screen.getByText('Built with Next.js and shadcn UI')).toBeInTheDocument();
  });
});
