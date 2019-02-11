// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';

import { formatBalance } from './';

describe('formatBalance', () => {
  const TESTVAL = new BN('123456789000');

  it('formats 123,456,789,000 (decimals=15)', () => {
    expect(
      formatBalance(TESTVAL, true, 15)
    ).toEqual('123.456 µUnit');
  });

  it('formats 123,456,789,000  (decimals=12)', () => {
    expect(
      formatBalance(TESTVAL, true, 12)
    ).toEqual('123.456 mUnit');
  });

  it('formats 123,456,789,000  (decimals=12, no SI)', () => {
    expect(
      formatBalance(TESTVAL, false, 12)
    ).toEqual('123.456 ');
  });

  it('formats 123,456,789,000 (decimals=9)', () => {
    expect(
      formatBalance(TESTVAL, true, 9)
    ).toEqual('123.456 Unit');
  });

  it('formats 123,456,789,000 (decimals=6)', () => {
    expect(
      formatBalance(TESTVAL, true, 6)
    ).toEqual('123.456 kUnit');
  });

  it('formats 123,456,789,000 * 10 (decimals=12)', () => {
    expect(
      formatBalance(TESTVAL.muln(10), true, 12)
    ).toEqual('1.234 Unit');
  });

  it('formats 123,456,789,000 * 100 (decimals=12)', () => {
    expect(
      formatBalance(TESTVAL.muln(100), true, 12)
    ).toEqual('12.345 Unit');
  });

  it('formats 123,456,789,000 * 1000 (decimals=12)', () => {
    expect(
      formatBalance(TESTVAL.muln(1000), true, 12)
    ).toEqual('123.456 Unit');
  });

  describe('findSi', () => {
    it('finds the SI value', () => {
      expect(
        formatBalance.findSi('k')
      ).toEqual({ power: 3, value: 'k', text: 'Kilo' });
    });

    it('returns default on not found', () => {
      expect(
        formatBalance.findSi('blah')
      ).toEqual({ power: 0, value: '-', text: 'Unit' });
    });
  });

  describe('setDefaultDecimals', () => {
    it('formats 123,456,789,000 (defaultDecimals=15)', () => {
      formatBalance.setDefaultDecimals(15);

      expect(
        formatBalance(TESTVAL)
      ).toEqual('123.456 µUnit');
    });
  });
});
