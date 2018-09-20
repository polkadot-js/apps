// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import React from 'react';

import { mount } from '../../../test/enzyme';
import { BIT_LENGTH_128 } from './constants';
import Input from './Input';
import { InputNumber } from './InputNumber';

const mockT = (key, options) => (key);

describe('InputNumber', () => {
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

  describe('isValidNumber', () => {
    describe('checks extrinsic balance', () => {
      it('throws an error if input value for comparison is not a string', () => {
        const invalidInputValueType = 340282366920938463463374607431768211456;

        expect(() => { wrapper.instance().isValidNumber(invalidInputValueType, '0', BIT_LENGTH_128); }).toThrow();
      });
    });
  });
});
