/**
 * Tests for the EmailSignInPage component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EmailSignInPage from '../page';
import { useAuth } from '@/components/auth/auth-provider';
import { useFormPersistence } from '@/hooks/use-form-persistence';
import { useToast } from '@/components/ui/use-toast';

// Mock the hooks
jest.mock('@/components/auth/auth-provider', () => ({
  useAuth: jest.fn(),
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

describe('EmailSignInPage', () => {
  // Setup mocks before each test
  beforeEach(() => {
    // Mock useAuth hook
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isSignInWithEmailLink: jest.fn().mockReturnValue(false),
      signInWithEmailLink: jest.fn().mockResolvedValue(false),
    });
    
    // Mock useFormPersistence hook
    (useFormPersistence as jest.Mock).mockReturnValue({
      formData: {
        email: '',
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
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });
  });
  
  // Clear mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders the sign-in form with email field', () => {
    render(<EmailSignInPage />);
    
    // Check that the form elements are rendered
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /complete sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });
  
  it('updates form data when email field changes', () => {
    const mockUpdateFormData = jest.fn();
    (useFormPersistence as jest.Mock).mockReturnValue({
      formData: {
        email: '',
      },
      updateFormData: mockUpdateFormData,
      resetFormData: jest.fn(),
      lastSaved: null,
      getTimeRemaining: jest.fn().mockReturnValue(null),
    });
    
    render(<EmailSignInPage />);
    
    // Fill out the email field
    const emailInput = screen.getByLabelText(/email address/i);
    fireEvent.change(emailInput, { target: { name: 'email', value: 'user@example.com' } });
    
    // Check that updateFormData was called with the correct value
    expect(mockUpdateFormData).toHaveBeenCalledWith({ email: 'user@example.com' });
  });
  
  it('calls signInWithEmailLink when form is submitted', async () => {
    const mockSignInWithEmailLink = jest.fn().mockResolvedValue(false);
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isSignInWithEmailLink: jest.fn().mockReturnValue(false),
      signInWithEmailLink: mockSignInWithEmailLink,
    });
    
    (useFormPersistence as jest.Mock).mockReturnValue({
      formData: {
        email: 'user@example.com',
      },
      updateFormData: jest.fn(),
      resetFormData: jest.fn(),
      lastSaved: null,
      getTimeRemaining: jest.fn().mockReturnValue(null),
    });
    
    render(<EmailSignInPage />);
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /complete sign in/i });
    fireEvent.click(submitButton);
    
    // Check that signInWithEmailLink was called with the correct value
    await waitFor(() => {
      expect(mockSignInWithEmailLink).toHaveBeenCalledWith('user@example.com');
    });
  });
  
  it('resets form data when clear button is clicked', () => {
    const mockResetFormData = jest.fn();
    (useFormPersistence as jest.Mock).mockReturnValue({
      formData: {
        email: 'user@example.com',
      },
      updateFormData: jest.fn(),
      resetFormData: mockResetFormData,
      lastSaved: null,
      getTimeRemaining: jest.fn().mockReturnValue(null),
    });
    
    render(<EmailSignInPage />);
    
    // Click the clear button
    const clearButton = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearButton);
    
    // Check that resetFormData was called
    expect(mockResetFormData).toHaveBeenCalled();
  });
});
