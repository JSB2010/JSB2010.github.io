/**
 * Basic tests for the useFormPersistence hook
 */

import { renderHook, act } from '@testing-library/react';
import { useFormPersistence } from '../use-form-persistence';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    store,
  };
})();

// Mock window.addEventListener for beforeunload event
const addEventListenerMock = jest.fn();
const removeEventListenerMock = jest.fn();

describe('useFormPersistence basic functionality', () => {
  // Setup mocks before each test
  beforeEach(() => {
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    localStorageMock.clear();
    jest.clearAllMocks();

    // Mock window event listeners
    window.addEventListener = addEventListenerMock;
    window.removeEventListener = removeEventListenerMock;

    // Setup fake timers for debounce testing
    jest.useFakeTimers();
  });

  // Restore original implementations after each test
  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should initialize with default values when no stored data exists', () => {
    const initialValues = { name: '', email: '' };

    const { result } = renderHook(() =>
      useFormPersistence('test-form', initialValues)
    );

    expect(result.current.formData).toEqual(initialValues);
    expect(result.current.isDirty).toBe(false);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('form_test-form');
  });

  it('should update form data when updateFormData is called', () => {
    const initialValues = { name: '', email: '' };

    const { result } = renderHook(() =>
      useFormPersistence('test-form', initialValues)
    );

    act(() => {
      result.current.updateFormData({ name: 'John Doe' });
    });

    expect(result.current.formData).toEqual({ name: 'John Doe', email: '' });
    expect(result.current.isDirty).toBe(true);
  });

  it('should reset form data when resetFormData is called', () => {
    const initialValues = { name: '', email: '' };

    const { result } = renderHook(() =>
      useFormPersistence('test-form', initialValues)
    );

    // First update the data
    act(() => {
      result.current.updateFormData({ name: 'John Doe', email: 'john@example.com' });
    });

    // Then reset it
    act(() => {
      result.current.resetFormData();
    });

    expect(result.current.formData).toEqual(initialValues);
    expect(result.current.isDirty).toBe(false);
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('form_test-form');
  });

  it('should set up beforeunload event listener when confirmOnUnload is true', () => {
    const initialValues = { name: '', email: '' };

    renderHook(() =>
      useFormPersistence('test-form', initialValues, { confirmOnUnload: true })
    );

    expect(addEventListenerMock).toHaveBeenCalledWith('beforeunload', expect.any(Function));
  });

  it('should manually save form data when saveForm is called', () => {
    const initialValues = { name: '', email: '' };

    const { result } = renderHook(() =>
      useFormPersistence('test-form', initialValues)
    );

    // First update the data
    act(() => {
      result.current.updateFormData({ name: 'John Doe' });
    });

    // Clear the mock to ensure we only capture the manual save
    localStorageMock.setItem.mockClear();

    // Then manually save it
    act(() => {
      result.current.saveForm();
    });

    expect(localStorageMock.setItem).toHaveBeenCalled();
    expect(result.current.isDirty).toBe(false);
  });

  it('should provide time remaining until expiry', () => {
    const initialValues = { name: '', email: '' };

    // Mock Date.now to return a fixed timestamp
    const now = new Date();
    jest.spyOn(global.Date, 'now').mockImplementation(() => now.getTime());

    const { result } = renderHook(() =>
      useFormPersistence('test-form', initialValues, { expiryMinutes: 90 })
    );

    // Update and save form data to set expiry
    act(() => {
      result.current.updateFormData({ name: 'John Doe' });
      result.current.saveForm();
    });

    // Check the time remaining calculation
    const timeRemaining = result.current.getTimeRemaining();
    expect(timeRemaining).not.toBeNull();
    expect(timeRemaining?.hours).toBe(1);
    expect(timeRemaining?.minutes).toBe(30);
    expect(timeRemaining?.seconds).toBe(0);
  });
});
