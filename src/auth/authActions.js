// Authentication actions using Firebase Auth
import {
    createUserWithEmailAndPassword,
    getIdToken,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from 'firebase/auth';
import { auth } from '../api/firebase';
import {
    checkLoginRateLimit,
    checkRegisterRateLimit,
    recordLoginAttempt,
    recordRegisterAttempt,
} from '../utils/delay';
import {
    clearAuthData,
    storeTokens,
    storeUserData
} from '../utils/storage';

/**
 * Register a new user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} displayName - User's display name (optional)
 * @returns {Promise<{success: boolean, user?: Object, error?: string}>}
 */
export const registerUser = async (email, password, displayName = '') => {
  try {
    // Check rate limiting
    const rateLimitCheck = await checkRegisterRateLimit();
    if (rateLimitCheck.isLimited) {
      return {
        success: false,
        error: rateLimitCheck.message,
      };
    }

    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile with display name if provided
    if (displayName.trim()) {
      await updateProfile(user, { displayName: displayName.trim() });
    }

    // Get ID token for storage
    const idToken = await getIdToken(user);
    
    // Prepare user data
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || displayName.trim() || '',
      emailVerified: user.emailVerified,
      photoURL: user.photoURL,
      createdAt: new Date().toISOString(),
    };

    // Store tokens and user data
    await storeTokens(idToken, user.refreshToken || '');
    await storeUserData(userData);

    // Record successful registration attempt
    await recordRegisterAttempt(true);

    return {
      success: true,
      user: userData,
    };
  } catch (error) {
    console.error('Registration error:', error);
    
    // Record failed registration attempt
    await recordRegisterAttempt(false);

    // Map Firebase errors to user-friendly messages
    let errorMessage = 'Registration failed. Please try again.';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'An account with this email already exists.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Please enter a valid email address.';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'Email/password accounts are not enabled.';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password should be at least 6 characters long.';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Please check your connection.';
        break;
      default:
        errorMessage = error.message || errorMessage;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Login user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<{success: boolean, user?: Object, error?: string}>}
 */
export const loginUser = async (email, password) => {
  try {
    // Check rate limiting
    const rateLimitCheck = await checkLoginRateLimit();
    if (rateLimitCheck.isLimited) {
      return {
        success: false,
        error: rateLimitCheck.message,
      };
    }

    // Sign in user
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get ID token for storage
    const idToken = await getIdToken(user);
    
    // Prepare user data
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || '',
      emailVerified: user.emailVerified,
      photoURL: user.photoURL,
      lastLoginAt: new Date().toISOString(),
    };

    // Store tokens and user data
    await storeTokens(idToken, user.refreshToken || '');
    await storeUserData(userData);

    // Record successful login attempt
    await recordLoginAttempt(true);

    return {
      success: true,
      user: userData,
    };
  } catch (error) {
    console.error('Login error:', error);
    
    // Record failed login attempt
    await recordLoginAttempt(false);

    // Map Firebase errors to user-friendly messages
    let errorMessage = 'Login failed. Please try again.';
    
    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage = 'Please enter a valid email address.';
        break;
      case 'auth/user-disabled':
        errorMessage = 'This account has been disabled.';
        break;
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email address.';
        break;
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        errorMessage = 'Invalid email or password.';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many failed attempts. Please try again later.';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Please check your connection.';
        break;
      default:
        errorMessage = error.message || errorMessage;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Logout current user
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const logoutUser = async () => {
  try {
    // Sign out from Firebase
    await signOut(auth);
    
    // Clear stored auth data
    await clearAuthData();

    return {
      success: true,
    };
  } catch (error) {
    console.error('Logout error:', error);
    
    return {
      success: false,
      error: 'Failed to logout. Please try again.',
    };
  }
};

/**
 * Send password reset email
 * @param {string} email - User's email
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    
    return {
      success: true,
    };
  } catch (error) {
    console.error('Password reset error:', error);
    
    let errorMessage = 'Failed to send password reset email.';
    
    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage = 'Please enter a valid email address.';
        break;
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email address.';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Please check your connection.';
        break;
      default:
        errorMessage = error.message || errorMessage;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Get fresh authentication token
 * @returns {Promise<{success: boolean, token?: string, error?: string}>}
 */
export const refreshAuthToken = async () => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      return {
        success: false,
        error: 'No authenticated user found.',
      };
    }

    // Force refresh the token
    const idToken = await getIdToken(user, true);
    
    // Update stored token
    await storeTokens(idToken, user.refreshToken || '');

    return {
      success: true,
      token: idToken,
    };
  } catch (error) {
    console.error('Token refresh error:', error);
    
    return {
      success: false,
      error: 'Failed to refresh authentication token.',
    };
  }
};

/**
 * Get current user data
 * @returns {Promise<{success: boolean, user?: Object, error?: string}>}
 */
export const getCurrentUser = async () => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      return {
        success: false,
        error: 'No authenticated user found.',
      };
    }

    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || '',
      emailVerified: user.emailVerified,
      photoURL: user.photoURL,
    };

    return {
      success: true,
      user: userData,
    };
  } catch (error) {
    console.error('Get current user error:', error);
    
    return {
      success: false,
      error: 'Failed to get current user data.',
    };
  }
};

/**
 * Set up authentication state listener
 * @param {Function} callback - Callback function to handle auth state changes
 * @returns {Function} Unsubscribe function
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        emailVerified: user.emailVerified,
        photoURL: user.photoURL,
      };
      callback({ isAuthenticated: true, user: userData });
    } else {
      // User is signed out
      callback({ isAuthenticated: false, user: null });
    }
  });
}; 