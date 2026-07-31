import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';
import type { ISODateString } from '@/types';

const toDate = (input: string | Date): Date => {
  const date = typeof input === 'string' ? parseISO(input) : input;
  return isValid(date) ? date : new Date(NaN);
};

export const formatDate = (input: ISODateString | Date, pattern = 'MMM d, yyyy'): string => {
  const date = toDate(input);
  return isValid(date) ? format(date, pattern) : '—';
};

export const formatDateTime = (input: ISODateString | Date, pattern = 'MMM d, yyyy · h:mm a'): string => {
  const date = toDate(input);
  return isValid(date) ? format(date, pattern) : '—';
};

export const formatRelative = (input: ISODateString | Date): string => {
  const date = toDate(input);
  return isValid(date) ? formatDistanceToNow(date, { addSuffix: true }) : '—';
};

export const formatTime = (input: ISODateString | Date, pattern = 'h:mm a'): string => {
  const date = toDate(input);
  return isValid(date) ? format(date, pattern) : '—';
};

export const isValidDate = (input: string | Date): boolean => isValid(toDate(input));
