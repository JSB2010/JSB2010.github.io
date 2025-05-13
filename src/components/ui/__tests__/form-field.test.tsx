import { render, screen, fireEvent } from '@testing-library/react';
import { FormField } from '../form-field';

describe('FormField Component', () => {
  it('renders a text input field with label', () => {
    render(<FormField label="Name" name="name" />);
    
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
  });
  
  it('renders a textarea when multiline is true', () => {
    render(<FormField label="Message" name="message" multiline rows={6} />);
    
    const textarea = screen.getByLabelText('Message');
    expect(textarea).toBeInTheDocument();
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveAttribute('rows', '6');
  });
  
  it('shows an error message when provided', () => {
    render(<FormField label="Email" name="email" error="Invalid email address" />);
    
    expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
  });
  
  it('applies custom className to the container', () => {
    const { container } = render(
      <FormField label="Name" name="name" className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });
  
  it('applies custom inputClassName to the input', () => {
    render(<FormField label="Name" name="name" inputClassName="custom-input-class" />);
    
    expect(screen.getByLabelText('Name')).toHaveClass('custom-input-class');
  });
  
  it('calls onChange handler when input value changes', () => {
    const handleChange = jest.fn();
    render(<FormField label="Name" name="name" onChange={handleChange} />);
    
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } });
    
    expect(handleChange).toHaveBeenCalled();
  });
  
  it('validates input based on validation rules on blur', () => {
    render(
      <FormField 
        label="Username" 
        name="username" 
        validationRules={{ 
          minLength: 3,
          required: true 
        }}
      />
    );
    
    const input = screen.getByLabelText('Username');
    
    // Enter an invalid value and blur
    fireEvent.change(input, { target: { value: 'ab' } });
    fireEvent.blur(input);
    
    // Check for validation error
    expect(screen.getByText('Must be at least 3 characters')).toBeInTheDocument();
    
    // Enter a valid value and blur
    fireEvent.change(input, { target: { value: 'john' } });
    fireEvent.blur(input);
    
    // Check for success message
    expect(screen.getByText('Valid')).toBeInTheDocument();
  });
  
  it('uses custom validation messages when provided', () => {
    render(
      <FormField 
        label="Password" 
        name="password" 
        type="password"
        validationRules={{ 
          minLength: 8,
          pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
        }}
        validationMessages={{
          minLength: 'Password must be at least 8 characters long',
          pattern: 'Password must contain at least one letter and one number'
        }}
      />
    );
    
    const input = screen.getByLabelText('Password');
    
    // Enter a short password and blur
    fireEvent.change(input, { target: { value: 'pass' } });
    fireEvent.blur(input);
    
    // Check for custom minLength message
    expect(screen.getByText('Password must be at least 8 characters long')).toBeInTheDocument();
    
    // Enter a password without numbers and blur
    fireEvent.change(input, { target: { value: 'passwordonly' } });
    fireEvent.blur(input);
    
    // Check for custom pattern message
    expect(screen.getByText('Password must contain at least one letter and one number')).toBeInTheDocument();
    
    // Enter a valid password and blur
    fireEvent.change(input, { target: { value: 'password123' } });
    fireEvent.blur(input);
    
    // Check for success message
    expect(screen.getByText('Valid')).toBeInTheDocument();
  });
  
  it('supports custom validation functions', () => {
    const customValidator = (value: string) => value.includes('@example.com');
    
    render(
      <FormField 
        label="Email" 
        name="email" 
        type="email"
        validationRules={{ 
          custom: customValidator
        }}
        validationMessages={{
          custom: 'Email must be from example.com domain'
        }}
      />
    );
    
    const input = screen.getByLabelText('Email');
    
    // Enter an invalid email and blur
    fireEvent.change(input, { target: { value: 'john@gmail.com' } });
    fireEvent.blur(input);
    
    // Check for custom validation message
    expect(screen.getByText('Email must be from example.com domain')).toBeInTheDocument();
    
    // Enter a valid email and blur
    fireEvent.change(input, { target: { value: 'john@example.com' } });
    fireEvent.blur(input);
    
    // Check for success message
    expect(screen.getByText('Valid')).toBeInTheDocument();
  });
});
