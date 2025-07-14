// Authentication Context Provider
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { isFirebaseConfigured } from '../api/firebase';
import { clearAuthData, getUserData } from '../utils/storage';
import { onAuthStateChange } from './authActions';

// Initial authentication state
const initialState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
  error: null,
};

// Authentication action types
const AUTH_ACTIONS = {
  AUTH_STATE_CHANGED: 'AUTH_STATE_CHANGED',
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  LOGOUT_START: 'LOGOUT_START',
  LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
  LOGOUT_FAILURE: 'LOGOUT_FAILURE',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_LOADING: 'SET_LOADING',
};

// Authentication reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.AUTH_STATE_CHANGED:
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.REGISTER_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: action.payload.error,
      };

    case AUTH_ACTIONS.LOGOUT_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case AUTH_ACTIONS.LOGOUT_SUCCESS:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGOUT_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload.isLoading,
      };

    default:
      return state;
  }
};

// Create authentication context
const AuthContext = createContext({
  state: initialState,
  dispatch: () => null,
});

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    let unsubscribe = null;

    const initializeAuth = async () => {
      try {
        // Check if Firebase is configured
        if (!isFirebaseConfigured) {
          console.warn('Firebase is not configured. Please add your Firebase credentials to .env file.');
          // Set auth state to not authenticated and not loading
          dispatch({
            type: AUTH_ACTIONS.AUTH_STATE_CHANGED,
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
          return;
        }

        // Set up Firebase auth state listener
        unsubscribe = onAuthStateChange(async (authState) => {
          if (authState.isAuthenticated && authState.user) {
            // User is authenticated, try to get stored user data
            const storedUserData = await getUserData();
            const user = storedUserData || authState.user;

            dispatch({
              type: AUTH_ACTIONS.AUTH_STATE_CHANGED,
              payload: {
                isAuthenticated: true,
                user: user,
              },
            });
          } else {
            // User is not authenticated, clear any stored data
            await clearAuthData();
            dispatch({
              type: AUTH_ACTIONS.AUTH_STATE_CHANGED,
              payload: {
                isAuthenticated: false,
                user: null,
              },
            });
          }
        });
      } catch (error) {
        console.error('Auth initialization error:', error);
        dispatch({
          type: AUTH_ACTIONS.AUTH_STATE_CHANGED,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initializeAuth();

    // Cleanup function
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const contextValue = {
    state,
    dispatch,
    // Auth action types for use in components
    AUTH_ACTIONS,
    // Configuration status
    isFirebaseConfigured,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthProvider; 