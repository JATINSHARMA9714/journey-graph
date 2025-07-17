// Simple helper functions

// Generate a simple unique ID
export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

// Check if a string is empty or just whitespace
export function isEmpty(str: string): boolean {
  return !str || str.trim().length === 0;
}

// Format date to readable string
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate URL format
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Deep copy an object
export function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}