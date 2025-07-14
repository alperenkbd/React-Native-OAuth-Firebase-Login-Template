// Custom hook for authentication operations
import { useCallback } from 'react';
import { useAuthContext } from './AuthProvider';
import {
    loginUser,
    logoutUser,
    refreshAuthToken,
    registerUser,
    sendPasswordReset,
} from './authActions';

/**
 * Custom hook for authentication operations
 * @returns {Object} Authentication state and actions
 */
export const useAuth = () => {
  const { state, dispatch, AUTH_ACTIONS, isFirebaseConfigured } = useAuthContext();

  /**
   * Login with email and password
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const login = useCallback(async (email, password) => {
    if (!isFirebaseConfigured) {
      return {
        success: false,
        error: 'Firebase is not configured. Please add your Firebase credentials to the .env file.',
      };
    }

    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      const result = await loginUser(email, password);

      if (result.success) {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user: result.user },
        });
        
        return { success: true };
      } else {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: { error: result.error },
        });
        
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred during login.';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: { error: errorMessage },
      });
      
      return { success: false, error: errorMessage };
    }
  }, [dispatch, AUTH_ACTIONS, isFirebaseConfigured]);

  /**
   * Register a new user
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @param {string} displayName - User's display name (optional)
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const register = useCallback(async (email, password, displayName = '') => {
    if (!isFirebaseConfigured) {
      return {
        success: false,
        error: 'Firebase is not configured. Please add your Firebase credentials to the .env file.',
      };
    }

    dispatch({ type: AUTH_ACTIONS.REGISTER_START });

    try {
      const result = await registerUser(email, password, displayName);

      if (result.success) {
        dispatch({
          type: AUTH_ACTIONS.REGISTER_SUCCESS,
          payload: { user: result.user },
        });
        
        return { success: true };
      } else {
        dispatch({
          type: AUTH_ACTIONS.REGISTER_FAILURE,
          payload: { error: result.error },
        });
        
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred during registration.';
      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAILURE,
        payload: { error: errorMessage },
      });
      
      return { success: false, error: errorMessage };
    }
  }, [dispatch, AUTH_ACTIONS, isFirebaseConfigured]);

  /**
   * Logout current user
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const logout = useCallback(async () => {
    if (!isFirebaseConfigured) {
      return {
        success: false,
        error: 'Firebase is not configured.',
      };
    }

    dispatch({ type: AUTH_ACTIONS.LOGOUT_START });

    try {
      const result = await logoutUser();

      if (result.success) {
        dispatch({ type: AUTH_ACTIONS.LOGOUT_SUCCESS });
        return { success: true };
      } else {
        dispatch({
          type: AUTH_ACTIONS.LOGOUT_FAILURE,
          payload: { error: result.error },
        });
        
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred during logout.';
      dispatch({
        type: AUTH_ACTIONS.LOGOUT_FAILURE,
        payload: { error: errorMessage },
      });
      
      return { success: false, error: errorMessage };
    }
  }, [dispatch, AUTH_ACTIONS, isFirebaseConfigured]);

  /**
   * Send password reset email
   * @param {string} email - User's email
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const resetPassword = useCallback(async (email) => {
    if (!isFirebaseConfigured) {
      return {
        success: false,
        error: 'Firebase is not configured. Please add your Firebase credentials to the .env file.',
      };
    }

    try {
      const result = await sendPasswordReset(email);
      return result;
    } catch (error) {
      return {
        success: false,
        error: 'An unexpected error occurred while sending password reset email.',
      };
    }
  }, [isFirebaseConfigured]);

  /**
   * Refresh authentication token
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const refreshToken = useCallback(async () => {
    if (!isFirebaseConfigured) {
      return {
        success: false,
        error: 'Firebase is not configured.',
      };
    }

    try {
      const result = await refreshAuthToken();
      return result;
    } catch (error) {
      return {
        success: false,
        error: 'An unexpected error occurred while refreshing token.',
      };
    }
  }, [isFirebaseConfigured]);

  /**
   * Clear authentication error
   */
  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  }, [dispatch, AUTH_ACTIONS]);

  /**
   * Set loading state manually (useful for external operations)
   * @param {boolean} isLoading - Loading state
   */
  const setLoading = useCallback((isLoading) => {
    dispatch({
      type: AUTH_ACTIONS.SET_LOADING,
      payload: { isLoading },
    });
  }, [dispatch, AUTH_ACTIONS]);

  // Return authentication state and actions
  return {
    // State
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    
    // Configuration status
    isFirebaseConfigured,
    
    // Actions
    login,
    register,
    logout,
    resetPassword,
    refreshToken,
    clearError,
    setLoading,
    
    // Helper computed values
    isLoggedIn: state.isAuthenticated && state.user !== null,
    userEmail: state.user?.email || null,
    userId: state.user?.uid || null,
    userDisplayName: state.user?.displayName || '',
    isEmailVerified: state.user?.emailVerified || false,
  };
};

export default useAuth; 