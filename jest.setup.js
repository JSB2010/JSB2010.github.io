// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Only run the window mocks if we're in a DOM environment
if (typeof window !== 'undefined') {
  // Mock the matchMedia function which is not implemented in JSDOM
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

// Mock next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    };
  },
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Set up global types for TypeScript
if (typeof global.jest !== 'undefined') {
  // This will be properly handled by TypeScript declaration merging
  // with the types in setupTests.ts
}

// Resolve the "ReferenceError: TextEncoder is not defined" error if needed
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Silence console errors during tests
const originalConsoleError = console.error;
console.error = (...args) => {
  // Filter out specific React-related warnings that might occur during testing
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning: ReactDOM.render') ||
     args[0].includes('Warning: React.createElement') ||
     args[0].includes('Error: Not implemented'))
  ) {
    return;
  }
  originalConsoleError(...args);
};
