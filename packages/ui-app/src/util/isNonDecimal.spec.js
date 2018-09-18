// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import isNonDecimal from './isNonDecimal';

describe('is value a decimal', () => {
  describe('invalid inputs', () => {
    it('detects non-decimal value', () => {
      expect(isNonDecimal('12.1copypastedvalue')).toBe(true);
    });
  });

  describe('valid inputs', () => {
    it('detects integers as valid decimal values', () => {
      expect(isNonDecimal('12')).toBe(false);
    });

    it('detects decimal value for single char without decimal point', () => {
      expect(isNonDecimal('0')).toBe(false);
    });

    it('detects decimal value for single char with decimal point', () => {
      expect(isNonDecimal('.')).toBe(false);
    });

    it('detects decimal value for string with multiple chars without decimal point', () => {
      expect(isNonDecimal('123')).toBe(false);
    });

    it('detects decimal value for string with multiple chars with decimal point', () => {
      expect(isNonDecimal('123.1')).toBe(false);
    });
  });
});
