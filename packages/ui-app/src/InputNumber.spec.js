// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import BN from 'bn.js';
import React from 'react';

import { mount } from '../../../test/enzyme';
import Input from './Input';
import { BIT_LENGTH_128, InputNumber } from './InputNumber';

const mockT = (key, options) => (key);

describe('InputNumber', () => {
  const max128BN = new BN(2).pow(new BN(128)).subn(1);
  const aboveMax128BN = max128BN.addn(1);
  const belowMax128BN = max128BN.subn(1);
  let wrapper, divInputNumber, defaultValue;

  beforeEach(() => {
    defaultValue = { value: '0' };
    wrapper = mount(
      <InputNumber
        defaultValue={defaultValue}
        t={mockT}
      />, {}
    );
    divInputNumber = wrapper.find('.ui--InputNumber');
  });

  it('creates the element', () => {
    expect(wrapper).toHaveLength(1);
  });

  it('should display InputNumber wrapper and Input component', () => {
    expect(divInputNumber).toHaveLength(1);
    expect(wrapper.find(Input)).toHaveLength(1);
  });

  describe('maxLength', () => {
    it('returns max length for use on number input fields that is the length of the max BN value minus a conservativeness factor for 128 bit', () => {
      const expectedMaxLength = 38;
      expect(wrapper.instance().maxLength(BIT_LENGTH_128)).toBe(expectedMaxLength);
    });
  });

  describe('maxValue', () => {
    it('returns max BN value for given bitlength or uses 128 bit bitlength fallback', () => {
      expect(wrapper.instance().maxValue(128)).toEqual(max128BN);
    });
  });

  describe('isNonDecimal', () => {
    describe('invalid inputs', () => {
      it('detects non-decimal value', () => {
        expect(wrapper.instance().isNonDecimal('12.1copypastedvalue')).toBe(true);
      });
    });

    describe('valid inputs', () => {
      it('detects integers as valid decimal values', () => {
        expect(wrapper.instance().isNonDecimal('12')).toBe(false);
      });

      it('detects decimal value for single char without decimal point', () => {
        expect(wrapper.instance().isNonDecimal('0')).toBe(false);
      });

      it('detects decimal value for single char with decimal point', () => {
        expect(wrapper.instance().isNonDecimal('.')).toBe(false);
      });

      it('detects decimal value for string with multiple chars without decimal point', () => {
        expect(wrapper.instance().isNonDecimal('123')).toBe(false);
      });

      it('detects decimal value for string with multiple chars with decimal point', () => {
        expect(wrapper.instance().isNonDecimal('123.1')).toBe(false);
      });
    });
  });

  describe('isValidBitLength', () => {
    it('returns whether value in BN is valid for given bitlength or uses 128 bit bitlength fallback', () => {
      expect(wrapper.instance().isValidBitLength(aboveMax128BN, BIT_LENGTH_128)).toBe(false);
      expect(wrapper.instance().isValidBitLength(max128BN, BIT_LENGTH_128)).toBe(true);
    });
  });

  describe('isValidNumber', () => {
    describe('checks extrinsic balance', () => {
      it('throws an error if input value for comparison is not a string', () => {
        const invalidInputValueType = 340282366920938463463374607431768211456;

        expect(() => { wrapper.instance().isValidNumber(invalidInputValueType, '0', BIT_LENGTH_128); }).toThrow();
      });
    });

    it('should not be valid when user enters a small decimal value greater than max bit length when using 128 bit', () => {
      const invalidValue = '0.00000000000000000000000000000001';
      const validValue = '0.0000000000000000000000000000001';
      expect(wrapper.instance().isValidNumber(invalidValue, BIT_LENGTH_128)).toBe(false);
      expect(wrapper.instance().isValidNumber(validValue, BIT_LENGTH_128)).toBe(true);
    });

    it('should not be valid when user enters positive value greater than or equal to the 128 bit max for latest chain', () => {
      expect(wrapper.instance().isValidNumber(max128BN.toString(10), BIT_LENGTH_128)).toBe(false);
    });

    it('should be valid when user enters positive value less than the 128 bit max for latest chain', () => {
      expect(wrapper.instance().isValidNumber(belowMax128BN.toString(10), BIT_LENGTH_128)).toBe(true);
    });
  });
});
