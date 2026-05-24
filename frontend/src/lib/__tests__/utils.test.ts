import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate } from '../utils';

describe('utils', () => {
  describe('formatCurrency', () => {
    it('formats USD correctly', () => {
      expect(formatCurrency(1000)).toBe('$1,000');
      expect(formatCurrency(1234567.89)).toBe('$1,234,568'); // rounds up based on no fraction digits
    });

    it('formats EUR correctly', () => {
      // Note: Intl format behavior can vary slightly by Node version/locale,
      // but typically EUR in en-US shows as "€1,000"
      expect(formatCurrency(1000, 'EUR')).toBe('€1,000');
    });
  });

  describe('formatDate', () => {
    it('formats standard ISO date string', () => {
      // Using a fixed timezone could be tricky if running in different timezones,
      // but for "2023-01-15T12:00:00Z" it works fine in most cases.
      // Let's test a simple date string that is timezone agnostic in JS Date parsing.
      expect(formatDate('2023-01-15')).toContain('Jan');
      expect(formatDate('2023-01-15')).toContain('2023');
    });
  });
});
