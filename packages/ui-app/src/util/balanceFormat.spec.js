// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import BN from 'bn.js';

import balanceFormat from './balanceFormat';

describe('balanceFormat', () => {
  const TESTVAL = new BN('123456789000');

  it('formats 123,456,789,000 as 123.456µ (decimals=15)', () => {
    expect(
      balanceFormat(TESTVAL, 15)
    ).toEqual('123.456µ');
  });

  it('formats 123,456,789,000 as 123.456m (decimals=12)', () => {
    expect(
      balanceFormat(TESTVAL, 12)
    ).toEqual('123.456m');
  });

  it('formats 123,456,789,000 as 123.456 (decimals=9)', () => {
    expect(
      balanceFormat(TESTVAL, 9)
    ).toEqual('123.456');
  });

  it('formats 123,456,789,000 as 123.456k (decimals=6)', () => {
    expect(
      balanceFormat(TESTVAL, 6)
    ).toEqual('123.456k');
  });

  it('formats 123,456,789,000 * 1000 as 123.456 (decimals=12)', () => {
    expect(
      balanceFormat(TESTVAL.muln(1000), 12)
    ).toEqual('123.456');
  });
});
