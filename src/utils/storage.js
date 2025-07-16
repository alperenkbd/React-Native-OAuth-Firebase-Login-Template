// Storage utilities for secure token management
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Keys for storing auth data
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'auth_access_token',
  REFRESH_TOKEN: 'auth_refresh_token',
  USER_DATA: 'auth_user_data',
  LAST_LOGIN: 'auth_last_login',
};

// Use SecureStore on mobile, AsyncStorage on web
const isSecureStoreAvailable = Platform.OS !== 'web';

/**
 * Securely store a key-value pair
 * @param {string} key - Storage key
 * @param {string} value - Value to store
 */
export const setSecureItem = async (key, value) => {
  try {
    if (isSecureStoreAvailable) {
      await SecureStore.setItemAsync(key, value);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  } catch (error) {
    console.error('Error storing secure item:', error);
    throw error;
  }
};

/**
 * Retrieve a securely stored value
 * @param {string} key - Storage key
 * @returns {Promise<string|null>} The stored value or null
 */
export const getSecureItem = async (key) => {
  try {
    if (isSecureStoreAvailable) {
      return await SecureStore.getItemAsync(key);
    } else {
      return await AsyncStorage.getItem(key);
    }
  } catch (error) {
    console.error('Error retrieving secure item:', error);
    return null;
  }
};

/**
 * Remove a securely stored item
 * @param {string} key - Storage key
 */
export const removeSecureItem = async (key) => {
  try {
    if (isSecureStoreAvailable) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await AsyncStorage.removeItem(key);
    }
  } catch (error) {
    console.error('Error removing secure item:', error);
    throw error;
  }
};

/**
 * Store authentication tokens
 * @param {string} accessToken - JWT access token
 * @param {string} refreshToken - Refresh token
 */
export const storeTokens = async (accessToken, refreshToken) => {
  try {
    await Promise.all([
      setSecureItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken),
      setSecureItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
      setSecureItem(STORAGE_KEYS.LAST_LOGIN, new Date().toISOString()),
    ]);
  } catch (error) {
    console.error('Error storing tokens:', error);
    throw error;
  }
};

/**
 * Retrieve stored authentication tokens
 * @returns {Promise<{accessToken: string|null, refreshToken: string|null}>}
 */
export const getTokens = async () => {
  try {
    const [accessToken, refreshToken] = await Promise.all([
      getSecureItem(STORAGE_KEYS.ACCESS_TOKEN),
      getSecureItem(STORAGE_KEYS.REFRESH_TOKEN),
    ]);
    
    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Error retrieving tokens:', error);
    return { accessToken: null, refreshToken: null };
  }
};

/**
 * Store user data
 * @param {Object} userData - User information object
 */
export const storeUserData = async (userData) => {
  try {
    await setSecureItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  } catch (error) {
    console.error('Error storing user data:', error);
    throw error;
  }
};

/**
 * Retrieve stored user data
 * @returns {Promise<Object|null>} User data object or null
 */
export const getUserData = async () => {
  try {
    const userData = await getSecureItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return null;
  }
};

/**
 * Clear all authentication data
 */
export const clearAuthData = async () => {
  try {
    await Promise.all([
      removeSecureItem(STORAGE_KEYS.ACCESS_TOKEN),
      removeSecureItem(STORAGE_KEYS.REFRESH_TOKEN),
      removeSecureItem(STORAGE_KEYS.USER_DATA),
      removeSecureItem(STORAGE_KEYS.LAST_LOGIN),
    ]);
  } catch (error) {
    console.error('Error clearing auth data:', error);
    throw error;
  }
};

/**
 * Get last login timestamp
 * @returns {Promise<Date|null>} Last login date or null
 */
export const getLastLogin = async () => {
  try {
    const lastLogin = await getSecureItem(STORAGE_KEYS.LAST_LOGIN);
    return lastLogin ? new Date(lastLogin) : null;
  } catch (error) {
    console.error('Error retrieving last login:', error);
    return null;
  }
};
export { STORAGE_KEYS };

