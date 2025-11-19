import { supabase } from '../supabase/config';

export interface LoginCredentials {
  email: string;
  password: string;
}

export class AuthService {
  /**
   * Sign in with email and password
   */
  static async signIn(credentials: LoginCredentials) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;

      return { success: true, data, error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { 
        success: false, 
        data: null, 
        error: error.message || 'Failed to sign in' 
      };
    }
  }

  /**
   * Sign out current user
   */
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true, error: null };
    } catch (error: any) {
      console.error('Sign out error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to sign out' 
      };
    }
  }

  /**
   * Get current session
   */
  static async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return { success: true, session, error: null };
    } catch (error: any) {
      console.error('Get session error:', error);
      return { 
        success: false, 
        session: null, 
        error: error.message || 'Failed to get session' 
      };
    }
  }

  /**
   * Get current user
   */
  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return { success: true, user, error: null };
    } catch (error: any) {
      console.error('Get user error:', error);
      return { 
        success: false, 
        user: null, 
        error: error.message || 'Failed to get user' 
      };
    }
  }

  /**
   * Listen to auth state changes
   */
  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }
}

