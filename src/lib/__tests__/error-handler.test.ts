// Mock the logger
jest.mock('@/lib/appwrite', () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  }
}));

import { 
  AppError, 
  ValidationError, 
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  RateLimitError,
  DatabaseError,
  ExternalServiceError,
  handleApiError,
  formatUserErrorMessage,
  shouldReportErrorToUser,
  createErrorFromResponse
} from '@/lib/error-handler';
import { logger } from '@/lib/appwrite';

describe('Error Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('AppError', () => {
    it('should create an AppError with default values', () => {
      const error = new AppError('Test error');
      
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('INTERNAL_ERROR');
      expect(error.statusCode).toBe(500);
      expect(error.isOperational).toBe(true);
      expect(error.context).toBeUndefined();
      expect(error.stack).toBeDefined();
    });

    it('should create an AppError with custom values', () => {
      const context = { userId: '123', action: 'test' };
      const error = new AppError(
        'Custom error',
        'CUSTOM_CODE',
        400,
        false,
        context
      );
      
      expect(error.message).toBe('Custom error');
      expect(error.code).toBe('CUSTOM_CODE');
      expect(error.statusCode).toBe(400);
      expect(error.isOperational).toBe(false);
      expect(error.context).toEqual(context);
    });
  });

  describe('Specialized Error Classes', () => {
    it('should create ValidationError with correct defaults', () => {
      const error = new ValidationError('Invalid input');
      
      expect(error.message).toBe('Invalid input');
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.statusCode).toBe(400);
      expect(error.isOperational).toBe(true);
    });

    it('should create AuthenticationError with correct defaults', () => {
      const error = new AuthenticationError('Not authenticated');
      
      expect(error.message).toBe('Not authenticated');
      expect(error.code).toBe('AUTHENTICATION_ERROR');
      expect(error.statusCode).toBe(401);
    });

    it('should create AuthorizationError with correct defaults', () => {
      const error = new AuthorizationError('Not authorized');
      
      expect(error.message).toBe('Not authorized');
      expect(error.code).toBe('AUTHORIZATION_ERROR');
      expect(error.statusCode).toBe(403);
    });

    it('should create NotFoundError with correct defaults', () => {
      const error = new NotFoundError('Resource not found');
      
      expect(error.message).toBe('Resource not found');
      expect(error.code).toBe('NOT_FOUND');
      expect(error.statusCode).toBe(404);
    });

    it('should create RateLimitError with correct defaults', () => {
      const error = new RateLimitError('Too many requests');
      
      expect(error.message).toBe('Too many requests');
      expect(error.code).toBe('RATE_LIMIT_EXCEEDED');
      expect(error.statusCode).toBe(429);
    });

    it('should create DatabaseError with correct defaults', () => {
      const error = new DatabaseError('Database connection failed');
      
      expect(error.message).toBe('Database connection failed');
      expect(error.code).toBe('DATABASE_ERROR');
      expect(error.statusCode).toBe(500);
    });

    it('should create ExternalServiceError with correct defaults', () => {
      const error = new ExternalServiceError('External API failed');
      
      expect(error.message).toBe('External API failed');
      expect(error.code).toBe('EXTERNAL_SERVICE_ERROR');
      expect(error.statusCode).toBe(502);
    });
  });

  describe('handleApiError', () => {
    it('should properly handle AppError instances', () => {
      const appError = new ValidationError('Invalid input', { field: 'email' });
      const result = handleApiError(appError);
      
      expect(result).toEqual({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Invalid input',
        statusCode: 400
      });
      
      expect(logger.error).toHaveBeenCalledWith('API Error: VALIDATION_ERROR', {
        message: 'Invalid input',
        statusCode: 400,
        context: { field: 'email' }
      });
    });

    it('should handle standard Error instances', () => {
      const standardError = new Error('Standard error');
      const result = handleApiError(standardError);
      
      expect(result).toEqual({
        success: false,
        error: 'INTERNAL_ERROR',
        message: 'Standard error',
        statusCode: 500
      });
      
      expect(logger.error).toHaveBeenCalledWith('Unhandled API Error', {
        name: 'Error',
        message: 'Standard error',
        stack: expect.any(String)
      });
    });

    it('should handle unknown error types', () => {
      const unknownError = { something: 'wrong' };
      const result = handleApiError(unknownError);
      
      expect(result).toEqual({
        success: false,
        error: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred',
        statusCode: 500
      });
      
      expect(logger.error).toHaveBeenCalledWith('Unknown API Error', { 
        error: { something: 'wrong' } 
      });
    });
  });

  describe('formatUserErrorMessage', () => {
    it('should format AppError messages', () => {
      const error = new ValidationError('Invalid input');
      expect(formatUserErrorMessage(error)).toBe('Invalid input');
    });

    it('should format standard Error messages', () => {
      const error = new Error('Error: Something went wrong');
      expect(formatUserErrorMessage(error)).toBe('Something went wrong');
    });

    it('should handle API errors', () => {
      const error = new Error('API error: Service unavailable');
      expect(formatUserErrorMessage(error)).toBe('Service unavailable');
    });

    it('should handle unknown error types', () => {
      const error = { notAnError: true };
      expect(formatUserErrorMessage(error)).toBe('An unexpected error occurred. Please try again later.');
    });
  });

  describe('shouldReportErrorToUser', () => {
    it('should return true for operational AppErrors', () => {
      const error = new ValidationError('Invalid input');
      expect(shouldReportErrorToUser(error)).toBe(true);
    });

    it('should return false for non-operational AppErrors', () => {
      const error = new AppError('Internal server error', 'INTERNAL_ERROR', 500, false);
      expect(shouldReportErrorToUser(error)).toBe(false);
    });

    it('should return true for standard errors', () => {
      const error = new Error('Standard error');
      expect(shouldReportErrorToUser(error)).toBe(true);
    });

    it('should return true for unknown error types', () => {
      const error = { something: 'wrong' };
      expect(shouldReportErrorToUser(error)).toBe(true);
    });
  });

  describe('createErrorFromResponse', () => {
    it('should create ValidationError for 400 responses', async () => {
      const mockResponse = {
        status: 400,
        json: jest.fn().mockResolvedValue({ message: 'Invalid request data' })
      } as unknown as Response;
      
      const error = await createErrorFromResponse(mockResponse);
      
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.message).toBe('Invalid request data');
      expect(error.statusCode).toBe(400);
    });

    it('should create AuthenticationError for 401 responses', async () => {
      const mockResponse = {
        status: 401,
        json: jest.fn().mockResolvedValue({ message: 'Authentication required' })
      } as unknown as Response;
      
      const error = await createErrorFromResponse(mockResponse);
      
      expect(error).toBeInstanceOf(AuthenticationError);
      expect(error.message).toBe('Authentication required');
      expect(error.statusCode).toBe(401);
    });

    it('should create generic AppError for other status codes', async () => {
      const mockResponse = {
        status: 503,
        json: jest.fn().mockResolvedValue({ 
          message: 'Service unavailable', 
          error: 'SERVICE_DOWN' 
        })
      } as unknown as Response;
      
      const error = await createErrorFromResponse(mockResponse);
      
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Service unavailable');
      expect(error.code).toBe('SERVICE_DOWN');
      expect(error.statusCode).toBe(503);
    });

    it('should handle JSON parse failures', async () => {
      const mockResponse = {
        status: 500,
        statusText: 'Internal Server Error',
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON'))
      } as unknown as Response;
      
      const error = await createErrorFromResponse(mockResponse);
      
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('API error: 500 Internal Server Error');
      expect(error.code).toBe('API_ERROR');
      expect(error.statusCode).toBe(500);
    });
  });
});
