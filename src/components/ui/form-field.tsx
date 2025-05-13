'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  name: string;
  error?: string;
  type?: string;
  multiline?: boolean;
  rows?: number;
  showValidation?: boolean;
  validationRules?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    required?: boolean;
    custom?: (value: string) => boolean;
  };
  validationMessages?: {
    minLength?: string;
    maxLength?: string;
    pattern?: string;
    required?: string;
    custom?: string;
  };
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  successClassName?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function FormField({
  label,
  name,
  error,
  type = 'text',
  multiline = false,
  rows = 4,
  showValidation = true,
  validationRules,
  validationMessages,
  className,
  inputClassName,
  labelClassName,
  errorClassName,
  successClassName,
  onChange,
  ...props
}: FormFieldProps) {
  const [value, setValue] = useState(props.defaultValue?.toString() || '');
  const [touched, setTouched] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  // Validate the input based on the validation rules
  const validateInput = (inputValue: string) => {
    if (!validationRules) {
      setIsValid(true);
      return true;
    }

    if (validationRules.required && !inputValue) {
      setValidationError(validationMessages?.required || 'This field is required');
      setIsValid(false);
      return false;
    }

    if (validationRules.minLength && inputValue.length < validationRules.minLength) {
      setValidationError(
        validationMessages?.minLength || 
        `Must be at least ${validationRules.minLength} characters`
      );
      setIsValid(false);
      return false;
    }

    if (validationRules.maxLength && inputValue.length > validationRules.maxLength) {
      setValidationError(
        validationMessages?.maxLength || 
        `Must be no more than ${validationRules.maxLength} characters`
      );
      setIsValid(false);
      return false;
    }

    if (validationRules.pattern && !validationRules.pattern.test(inputValue)) {
      setValidationError(
        validationMessages?.pattern || 
        'Please enter a valid value'
      );
      setIsValid(false);
      return false;
    }

    if (validationRules.custom && !validationRules.custom(inputValue)) {
      setValidationError(
        validationMessages?.custom || 
        'Please enter a valid value'
      );
      setIsValid(false);
      return false;
    }

    setValidationError(null);
    setIsValid(true);
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    if (touched) {
      validateInput(newValue);
    }
    
    if (onChange) {
      onChange(e);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    validateInput(value);
  };

  // Determine if we should show an error
  const showError = (touched && validationError) || error;
  
  // Determine if we should show success
  const showSuccess = touched && isValid && showValidation && !showError;

  return (
    <div className={cn('space-y-2', className)}>
      <label 
        htmlFor={name} 
        className={cn(
          'text-sm font-medium block', 
          labelClassName
        )}
      >
        {label}
      </label>
      
      {multiline ? (
        <Textarea
          id={name}
          name={name}
          rows={rows}
          className={cn(
            showError ? 'border-red-500 focus-visible:ring-red-500' : '',
            showSuccess ? 'border-green-500 focus-visible:ring-green-500' : '',
            inputClassName
          )}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={showError ? 'true' : 'false'}
          aria-describedby={showError ? `${name}-error` : undefined}
          {...props as React.TextareaHTMLAttributes<HTMLTextAreaElement>}
        />
      ) : (
        <Input
          id={name}
          name={name}
          type={type}
          className={cn(
            showError ? 'border-red-500 focus-visible:ring-red-500' : '',
            showSuccess ? 'border-green-500 focus-visible:ring-green-500' : '',
            inputClassName
          )}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={showError ? 'true' : 'false'}
          aria-describedby={showError ? `${name}-error` : undefined}
          {...props as React.InputHTMLAttributes<HTMLInputElement>}
        />
      )}
      
      {showError && (
        <p 
          id={`${name}-error`}
          className={cn(
            'text-sm text-red-500 flex items-center gap-1',
            errorClassName
          )}
        >
          <AlertCircle className="h-4 w-4" />
          {error || validationError}
        </p>
      )}
      
      {showSuccess && (
        <p 
          className={cn(
            'text-sm text-green-500 flex items-center gap-1',
            successClassName
          )}
        >
          <CheckCircle className="h-4 w-4" />
          Valid
        </p>
      )}
    </div>
  );
}
