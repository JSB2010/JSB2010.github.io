/**
 * Tests for the AdminLoginPage component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminLoginPage from '../page';
import { useAdminAuth } from '@/components/admin/auth-context';
import { useFormPersistence } from '@/hooks/use-form-persistence';
import { useToast } from '@/components/ui/use-toast';

// Mock the hooks
jest.mock('@/components/admin/auth-context', () => ({
  useAdminAuth: jest.fn(),
}));

jest.mock('@/hooks/use-form-persistence', () => ({
  useFormPersistence: jest.fn(),
}));

jest.mock('@/components/ui/use-toast', () => ({
  useToast: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('AdminLoginPage', () => {
  // Setup mocks before each test
  beforeEach(() => {
    // Mock useAdminAuth hook
    (useAdminAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
      error: null,
      signIn: jest.fn().mockResolvedValue(false),
      clearError: jest.fn(),
    });
    
    // Mock useFormPersistence hook
    (useFormPersistence as jest.Mock).mockReturnValue({
      formData: {
        email: '',
        password: '',
      },
      updateFormData: jest.fn(),
      resetFormData: jest.fn(),
      lastSaved: null,
      getTimeRemaining: jest.fn().mockReturnValue(null),
    });
    
    // Mock useToast hook
    (useToast as jest.Mock).mockReturnValue({
      toast: jest.fn(),
    });
  });
  
  // Clear mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders the login form with all fields', () => {
    render(<AdminLoginPage />);
    
    // Check that all form elements are rendered
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });
  
  it('updates form data when fields change', () => {
    const mockUpdateFormData = jest.fn();
    (useFormPersistence as jest.Mock).mockReturnValue({
      formData: {
        email: '',
        password: '',
      },
      updateFormData: mockUpdateFormData,
      resetFormData: jest.fn(),
      lastSaved: null,
      getTimeRemaining: jest.fn().mockReturnValue(null),
    });
    
    render(<AdminLoginPage />);
    
    // Fill out the email field
    const emailInput = screen.getByLabelText(/email address/i);
    fireEvent.change(emailInput, { target: { name: 'email', value: 'admin@example.com' } });
    
    // Check that updateFormData was called with the correct value
    expect(mockUpdateFormData).toHaveBeenCalledWith({ email: 'admin@example.com' });
  });
  
  it('calls signIn when form is submitted', async () => {
    const mockSignIn = jest.fn().mockResolvedValue(false);
    (useAdminAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
      error: null,
      signIn: mockSignIn,
      clearError: jest.fn(),
    });
    
    (useFormPersistence as jest.Mock).mockReturnValue({
      formData: {
        email: 'admin@example.com',
        password: 'password123',
      },
      updateFormData: jest.fn(),
      resetFormData: jest.fn(),
      lastSaved: null,
      getTimeRemaining: jest.fn().mockReturnValue(null),
    });
    
    render(<AdminLoginPage />);
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);
    
    // Check that signIn was called with the correct values
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('admin@example.com', 'password123');
    });
  });
  
  it('resets form data when clear button is clicked', () => {
    const mockResetFormData = jest.fn();
    (useFormPersistence as jest.Mock).mockReturnValue({
      formData: {
        email: 'admin@example.com',
        password: 'password123',
      },
      updateFormData: jest.fn(),
      resetFormData: mockResetFormData,
      lastSaved: null,
      getTimeRemaining: jest.fn().mockReturnValue(null),
    });
    
    render(<AdminLoginPage />);
    
    // Click the clear button
    const clearButton = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearButton);
    
    // Check that resetFormData was called
    expect(mockResetFormData).toHaveBeenCalled();
  });
});
