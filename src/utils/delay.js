// Rate limiting utility for authentication operations
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys for rate limiting
const RATE_LIMIT_KEYS = {
  LOGIN_ATTEMPTS: 'rate_limit_login_attempts',
  LAST_LOGIN_ATTEMPT: 'rate_limit_last_login_attempt',
  REGISTER_ATTEMPTS: 'rate_limit_register_attempts',
  LAST_REGISTER_ATTEMPT: 'rate_limit_last_register_attempt',
};

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  MAX_LOGIN_ATTEMPTS: 5,
  MAX_REGISTER_ATTEMPTS: 3,
  LOGIN_COOLDOWN_MINUTES: 15,
  REGISTER_COOLDOWN_MINUTES: 5,
  BASE_DELAY_MS: 1000, // Base delay between attempts
  MAX_DELAY_MS: 10000, // Maximum delay
};

/**
 * Create a delay promise
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise<void>}
 */
export const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Calculate exponential backoff delay
 * @param {number} attemptCount - Number of previous attempts
 * @param {number} baseDelay - Base delay in milliseconds
 * @param {number} maxDelay - Maximum delay in milliseconds
 * @returns {number} Delay in milliseconds
 */
export const calculateBackoffDelay = (attemptCount, baseDelay = RATE_LIMIT_CONFIG.BASE_DELAY_MS, maxDelay = RATE_LIMIT_CONFIG.MAX_DELAY_MS) => {
  const exponentialDelay = baseDelay * Math.pow(2, attemptCount - 1);
  return Math.min(exponentialDelay, maxDelay);
};

/**
 * Get stored attempt data
 * @param {string} key - Storage key for attempts
 * @returns {Promise<{count: number, lastAttempt: Date|null}>}
 */
const getAttemptData = async (key) => {
  try {
    const data = await AsyncStorage.getItem(key);
    if (data) {
      const parsed = JSON.parse(data);
      return {
        count: parsed.count || 0,
        lastAttempt: parsed.lastAttempt ? new Date(parsed.lastAttempt) : null,
      };
    }
  } catch (error) {
    console.error('Error getting attempt data:', error);
  }
  
  return { count: 0, lastAttempt: null };
};

/**
 * Store attempt data
 * @param {string} key - Storage key for attempts
 * @param {number} count - Attempt count
 * @param {Date} lastAttempt - Last attempt timestamp
 */
const storeAttemptData = async (key, count, lastAttempt) => {
  try {
    const data = {
      count,
      lastAttempt: lastAttempt.toISOString(),
    };
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error storing attempt data:', error);
  }
};

/**
 * Check if user is rate limited for login
 * @returns {Promise<{isLimited: boolean, waitTime: number, message: string}>}
 */
export const checkLoginRateLimit = async () => {
  const { count, lastAttempt } = await getAttemptData(RATE_LIMIT_KEYS.LOGIN_ATTEMPTS);
  
  if (count >= RATE_LIMIT_CONFIG.MAX_LOGIN_ATTEMPTS && lastAttempt) {
    const cooldownEndTime = new Date(lastAttempt.getTime() + (RATE_LIMIT_CONFIG.LOGIN_COOLDOWN_MINUTES * 60 * 1000));
    const now = new Date();
    
    if (now < cooldownEndTime) {
      const waitTime = Math.ceil((cooldownEndTime - now) / 1000 / 60); // minutes
      return {
        isLimited: true,
        waitTime,
        message: `Too many login attempts. Please wait ${waitTime} minutes before trying again.`,
      };
    } else {
      // Reset attempts after cooldown period
      await AsyncStorage.removeItem(RATE_LIMIT_KEYS.LOGIN_ATTEMPTS);
      return { isLimited: false, waitTime: 0, message: '' };
    }
  }
  
  return { isLimited: false, waitTime: 0, message: '' };
};

/**
 * Check if user is rate limited for registration
 * @returns {Promise<{isLimited: boolean, waitTime: number, message: string}>}
 */
export const checkRegisterRateLimit = async () => {
  const { count, lastAttempt } = await getAttemptData(RATE_LIMIT_KEYS.REGISTER_ATTEMPTS);
  
  if (count >= RATE_LIMIT_CONFIG.MAX_REGISTER_ATTEMPTS && lastAttempt) {
    const cooldownEndTime = new Date(lastAttempt.getTime() + (RATE_LIMIT_CONFIG.REGISTER_COOLDOWN_MINUTES * 60 * 1000));
    const now = new Date();
    
    if (now < cooldownEndTime) {
      const waitTime = Math.ceil((cooldownEndTime - now) / 1000 / 60); // minutes
      return {
        isLimited: true,
        waitTime,
        message: `Too many registration attempts. Please wait ${waitTime} minutes before trying again.`,
      };
    } else {
      // Reset attempts after cooldown period
      await AsyncStorage.removeItem(RATE_LIMIT_KEYS.REGISTER_ATTEMPTS);
      return { isLimited: false, waitTime: 0, message: '' };
    }
  }
  
  return { isLimited: false, waitTime: 0, message: '' };
};

/**
 * Record a login attempt and apply rate limiting delay
 * @param {boolean} isSuccess - Whether the login was successful
 * @returns {Promise<void>}
 */
export const recordLoginAttempt = async (isSuccess = false) => {
  const { count } = await getAttemptData(RATE_LIMIT_KEYS.LOGIN_ATTEMPTS);
  const now = new Date();
  
  if (isSuccess) {
    // Clear attempts on successful login
    await AsyncStorage.removeItem(RATE_LIMIT_KEYS.LOGIN_ATTEMPTS);
    return;
  }
  
  // Record failed attempt
  const newCount = count + 1;
  await storeAttemptData(RATE_LIMIT_KEYS.LOGIN_ATTEMPTS, newCount, now);
  
  // Apply exponential backoff delay for failed attempts
  if (newCount > 1) {
    const delayMs = calculateBackoffDelay(newCount);
    await delay(delayMs);
  }
};

/**
 * Record a registration attempt and apply rate limiting delay
 * @param {boolean} isSuccess - Whether the registration was successful
 * @returns {Promise<void>}
 */
export const recordRegisterAttempt = async (isSuccess = false) => {
  const { count } = await getAttemptData(RATE_LIMIT_KEYS.REGISTER_ATTEMPTS);
  const now = new Date();
  
  if (isSuccess) {
    // Clear attempts on successful registration
    await AsyncStorage.removeItem(RATE_LIMIT_KEYS.REGISTER_ATTEMPTS);
    return;
  }
  
  // Record failed attempt
  const newCount = count + 1;
  await storeAttemptData(RATE_LIMIT_KEYS.REGISTER_ATTEMPTS, newCount, now);
  
  // Apply exponential backoff delay for failed attempts
  if (newCount > 1) {
    const delayMs = calculateBackoffDelay(newCount);
    await delay(delayMs);
  }
};

/**
 * Clear all rate limiting data
 */
export const clearRateLimitData = async () => {
  try {
    await Promise.all([
      AsyncStorage.removeItem(RATE_LIMIT_KEYS.LOGIN_ATTEMPTS),
      AsyncStorage.removeItem(RATE_LIMIT_KEYS.REGISTER_ATTEMPTS),
    ]);
  } catch (error) {
    console.error('Error clearing rate limit data:', error);
  }
};

export { RATE_LIMIT_CONFIG };
