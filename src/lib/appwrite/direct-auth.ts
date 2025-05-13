// Direct Appwrite authentication service with CORS workarounds
import { Account, ID, Models } from 'appwrite';
import { createClient } from './client';

// Types
export interface AuthUser {
  $id: string;
  email: string;
  name?: string;
  emailVerification: boolean;
  status: boolean;
}

// Error types
export enum AuthErrorType {
  INVALID_CREDENTIALS = 'invalid_credentials',
  USER_NOT_FOUND = 'user_not_found',
  EMAIL_ALREADY_EXISTS = 'email_already_exists',
  NETWORK_ERROR = 'network_error',
  UNKNOWN_ERROR = 'unknown_error',
}

export interface AuthError {
  type: AuthErrorType;
  message: string;
  originalError?: any;
}

/**
 * Authentication service for Appwrite with CORS workarounds
 */
export class DirectAuthService {
  private client = createClient();
  private account = new Account(this.client);

  /**
   * Create a new account
   * @param email Email address
   * @param password Password
   * @param name Optional name
   */
  async createAccount(email: string, password: string, name?: string): Promise<AuthUser | AuthError> {
    try {
      // In Appwrite v14, the create method has a different signature
      const user = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );

      return this.mapUser(user);
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  /**
   * Sign in with email and password
   * @param email Email address
   * @param password Password
   */
  async signIn(email: string, password: string): Promise<AuthUser | AuthError> {
    try {
      // In Appwrite v14, we use createEmailPasswordSession
      const session = await this.account.createEmailPasswordSession(email, password);
      
      // Set cookies manually to work around CORS issues
      if (typeof window !== 'undefined') {
        // Store the session ID in localStorage as a fallback
        localStorage.setItem('appwrite_session', session.$id);
      }
      
      const user = await this.account.get();

      return this.mapUser(user);
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<boolean> {
    try {
      // In Appwrite v14, we use deleteSession
      await this.account.deleteSession('current');
      
      // Clear the session ID from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('appwrite_session');
      }
      
      return true;
    } catch (error) {
      console.error('Error signing out:', error);
      return false;
    }
  }

  /**
   * Get the current user
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      // Try to get the current user
      const user = await this.account.get();
      return this.mapUser(user);
    } catch (error) {
      // If there's an error, try to restore the session from localStorage
      if (typeof window !== 'undefined') {
        const sessionId = localStorage.getItem('appwrite_session');
        if (sessionId) {
          try {
            // Try to create a new session with the stored session ID
            await this.account.getSession(sessionId);
            const user = await this.account.get();
            return this.mapUser(user);
          } catch (sessionError) {
            // If that fails, clear the session ID from localStorage
            localStorage.removeItem('appwrite_session');
            return null;
          }
        }
      }
      
      return null;
    }
  }

  /**
   * Check if the user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      await this.account.get();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Map Appwrite user to AuthUser
   */
  private mapUser(user: any): AuthUser {
    return {
      $id: user.$id,
      email: user.email,
      name: user.name,
      emailVerification: user.emailVerification,
      status: user.status,
    };
  }

  /**
   * Handle authentication errors
   */
  private handleError(error: any): AuthError {
    console.error('Auth error:', error);

    if (error.code === 401) {
      return {
        type: AuthErrorType.INVALID_CREDENTIALS,
        message: 'Invalid email or password',
        originalError: error,
      };
    }

    if (error.code === 404) {
      return {
        type: AuthErrorType.USER_NOT_FOUND,
        message: 'User not found',
        originalError: error,
      };
    }

    if (error.code === 409) {
      return {
        type: AuthErrorType.EMAIL_ALREADY_EXISTS,
        message: 'Email already exists',
        originalError: error,
      };
    }

    if (error.code === 0 || error.message?.includes('network')) {
      return {
        type: AuthErrorType.NETWORK_ERROR,
        message: 'Network error. Please check your connection and try again.',
        originalError: error,
      };
    }

    return {
      type: AuthErrorType.UNKNOWN_ERROR,
      message: error.message || 'An unknown error occurred',
      originalError: error,
    };
  }
}

// Create a singleton instance
export const directAuthService = new DirectAuthService();
