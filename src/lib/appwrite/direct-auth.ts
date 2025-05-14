// Direct Appwrite authentication service with CORS workarounds
import { Account, ID, Models } from 'appwrite';
import { createClient } from './client';
import { storeSession, clearSession, getStoredSessionId } from './session-manager';

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

      // Store session information using the session manager
      storeSession(session.$id);

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

      // Clear session data using the session manager
      clearSession();

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
      // Try to get the current user directly
      const user = await this.account.get();
      return this.mapUser(user);
    } catch (error) {
      // If that fails, try to restore the session from localStorage
      const sessionId = getStoredSessionId();

      if (sessionId) {
        try {
          // Try to get the session using the stored ID
          await this.account.getSession(sessionId);

          // If successful, try to get the user again
          const user = await this.account.get();
          return this.mapUser(user);
        } catch (sessionError) {
          // If session restoration fails, clean up localStorage
          console.warn('Failed to restore session:', sessionError);
          clearSession();
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
