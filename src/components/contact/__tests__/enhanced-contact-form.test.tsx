import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EnhancedContactForm } from '../enhanced-contact-form';
import { useFormPersistence } from '@/hooks/use-form-persistence';
import { useToast } from '@/components/ui/use-toast';

// Mock the hooks
jest.mock('@/hooks/use-form-persistence', () => ({
  useFormPersistence: jest.fn(),
}));

jest.mock('@/components/ui/use-toast', () => ({
  useToast: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe('EnhancedContactForm', () => {
  // Set up mocks before each test
  beforeEach(() => {
    // Mock useFormPersistence hook
    (useFormPersistence as jest.Mock).mockReturnValue({
      formData: {
        name: '',
        email: '',
        subject: '',
        message: '',
      },
      updateFormData: jest.fn(),
      resetFormData: jest.fn(),
    });

    // Mock useToast hook
    (useToast as jest.Mock).mockReturnValue({
      toast: jest.fn(),
    });

    // Mock fetch
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
  });

  // Clear mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form correctly', () => {
    render(<EnhancedContactForm />);
    
    // Check if form elements are rendered
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear form/i })).toBeInTheDocument();
  });

  it('updates form data when inputs change', () => {
    const mockUpdateFormData = jest.fn();
    (useFormPersistence as jest.Mock).mockReturnValue({
      formData: {
        name: '',
        email: '',
        subject: '',
        message: '',
      },
      updateFormData: mockUpdateFormData,
      resetFormData: jest.fn(),
    });

    render(<EnhancedContactForm />);
    
    // Simulate input changes
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    
    // Check if updateFormData was called
    expect(mockUpdateFormData).toHaveBeenCalled();
  });

  it('submits the form successfully', async () => {
    const mockToast = jest.fn();
    const mockResetFormData = jest.fn();
    
    (useToast as jest.Mock).mockReturnValue({
      toast: mockToast,
    });
    
    (useFormPersistence as jest.Mock).mockReturnValue({
      formData: {
        name: '',
        email: '',
        subject: '',
        message: '',
      },
      updateFormData: jest.fn(),
      resetFormData: mockResetFormData,
    });

    render(<EnhancedContactForm />);
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/subject/i), { target: { value: 'Test Subject' } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'This is a test message that is long enough.' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    
    // Check if fetch was called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/contact', expect.any(Object));
      
      // Check if success toast was shown
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Message Sent',
      }));
      
      // Check if form data was reset
      expect(mockResetFormData).toHaveBeenCalled();
    });
  });

  it('handles form submission errors', async () => {
    const mockToast = jest.fn();
    
    (useToast as jest.Mock).mockReturnValue({
      toast: mockToast,
    });
    
    // Mock fetch to return an error
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Server error' }),
    });

    render(<EnhancedContactForm />);
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/subject/i), { target: { value: 'Test Subject' } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'This is a test message that is long enough.' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    
    // Check if error toast was shown
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Error',
        variant: 'destructive',
      }));
    });
  });

  it('clears the form when the clear button is clicked', () => {
    const mockReset = jest.fn();
    const mockResetFormData = jest.fn();
    
    // Mock the reset function from useForm
    jest.mock('react-hook-form', () => ({
      ...jest.requireActual('react-hook-form'),
      useForm: () => ({
        handleSubmit: jest.fn(),
        formState: { errors: {} },
        reset: mockReset,
        setValue: jest.fn(),
        getValues: jest.fn(),
      }),
    }));
    
    (useFormPersistence as jest.Mock).mockReturnValue({
      formData: {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Test message',
      },
      updateFormData: jest.fn(),
      resetFormData: mockResetFormData,
    });

    render(<EnhancedContactForm />);
    
    // Click the clear button
    fireEvent.click(screen.getByRole('button', { name: /clear form/i }));
    
    // Check if resetFormData was called
    expect(mockResetFormData).toHaveBeenCalled();
  });
});
