// ============================================================
// ATHLETE//ZERO — Utility Functions
// ============================================================

/**
 * Random integer between min and max (inclusive)
 */
export const randInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Random float between min and max
 */
export const randFloat = (min: number, max: number): number =>
  parseFloat((Math.random() * (max - min) + min).toFixed(2));

/**
 * Pick a random element from an array
 */
export const pickRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

/**
 * Pick N unique random elements from an array
 */
export const pickRandomN = <T>(arr: T[], n: number): T[] => {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, arr.length));
};

/**
 * Clamp a value between min and max
 */
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/**
 * Format a number with commas (e.g. 1000000 -> "1,000,000")
 */
export const formatNumber = (n: number): string => n.toLocaleString('en-IN');

/**
 * Generate a formatted timestamp string
 */
export const now = (): string => new Date().toISOString();

/**
 * Build a standard API success response
 */
export const successResponse = <T>(data: T, message?: string) => ({
  success: true,
  data,
  message: message || 'OK',
  timestamp: now(),
});

/**
 * Build a standard API error response
 */
export const errorResponse = (message: string, code?: number) => ({
  success: false,
  error: message,
  code: code || 400,
  timestamp: now(),
});

/**
 * Sleep for N milliseconds (for simulating delay)
 */
export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Weighted random boolean — trueWeight is 0-1
 */
export const weightedBool = (trueWeight: number): boolean => Math.random() < trueWeight;
