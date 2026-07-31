/**
 * Phone number formatting utilities.
 */

const stripNonDigits = (value: string): string => value.replace(/\D/g, '');

export const normalizePhone = (value: string): string => {
  const digits = stripNonDigits(value);
  if (digits.length === 0) return '';
  if (digits.startsWith('00')) return '+' + digits.slice(2);
  if (value.trim().startsWith('+')) return '+' + digits;
  return digits;
};

export const formatPhone = (value: string): string => {
  const trimmed = value.trim();
  const digits = stripNonDigits(trimmed);
  if (digits.length <= 3) return trimmed;
  if (digits.length <= 7) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 11)}`.trim();
};

export const formatPhoneInternational = (value: string): string => {
  const normalized = normalizePhone(value);
  if (!normalized.startsWith('+')) return formatPhone(value);
  const digits = normalized.slice(1);
  return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 9)} ${digits.slice(9, 12)}`.trim();
};

export const isValidPhone = (value: string): boolean => {
  const digits = stripNonDigits(value);
  return digits.length >= 7 && digits.length <= 15;
};
