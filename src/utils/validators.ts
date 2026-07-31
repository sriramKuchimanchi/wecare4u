/**
 * Lightweight validators reused across forms and services.
 */
export const isEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const isNonEmpty = (value: string): boolean => value.trim().length > 0;

export const isStrongPassword = (value: string): boolean =>
  value.length >= 8 && /[A-Za-z]/.test(value) && /\d/.test(value);

export const isUrl = (value: string): boolean => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

export const isInRange = (value: number, min: number, max: number): boolean =>
  value >= min && value <= max;
