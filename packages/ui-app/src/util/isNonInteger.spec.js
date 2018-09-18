// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import isNonInteger from './isNonInteger';

describe('is value an integer', () => {
  describe('invalid inputs', () => {
    it('detects non-integer value', () => {
      expect(isNonInteger('12copypastedvalue')).toBe(true);
    });

    it('detects non-integer value is decimal point', () => {
      expect(isNonInteger('12.')).toBe(true);
    });
  });

  describe('valid inputs', () => {
    it('detects integer value for single char', () => {
      expect(isNonInteger('0')).toBe(false);
    });

    it('detects integer value for string with multiple chars', () => {
      expect(isNonInteger('123')).toBe(false);
    });
  });
});
