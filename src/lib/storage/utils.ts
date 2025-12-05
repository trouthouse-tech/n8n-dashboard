import { STORAGE_KEYS, ApiResponse, HTTP_STATUS } from './types';

/**
 * Generate a unique ID similar to Firebase's auto-generated IDs
 */
export const generateId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 20; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

/**
 * Get current ISO timestamp
 */
export const getTimestamp = (): string => new Date().toISOString();

/**
 * Safely get data from localStorage
 */
export const getStorageData = <T>(key: STORAGE_KEYS): T | null => {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    console.error(`Failed to parse localStorage data for key: ${key}`);
    return null;
  }
};

/**
 * Safely set data to localStorage
 */
export const setStorageData = <T>(key: STORAGE_KEYS, data: T): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Failed to save to localStorage for key: ${key}`, error);
    return false;
  }
};

/**
 * Create a success response
 */
export const createSuccessResponse = <T>(
  data: T,
  statusCode: number = HTTP_STATUS.OK
): ApiResponse<T> => ({
  success: true,
  data,
  statusCode,
});

/**
 * Create an error response
 */
export const createErrorResponse = <T = never>(
  code: string,
  message: string,
  statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  details?: unknown
): ApiResponse<T> => ({
  success: false,
  error: { code, message, details },
  statusCode,
});

