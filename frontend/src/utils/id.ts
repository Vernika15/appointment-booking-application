/**
 * Generates a unique ID string using a random base-36 segment and current timestamp.
 *
 * @returns {string} A unique identifier string (e.g., "_k9x8q3z4n1627482929483").
 *
 * @example
 * const id = generateId(); // "_abc123xyz1627482929483"
 */
export function generateId(): string {
  return "_" + Math.random().toString(36).substr(2, 9) + Date.now();
}
