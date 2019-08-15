// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { hexToU8a } from '@polkadot/util';

import { publicToAddr } from './util';

describe('publicToAddr', (): void => {
  it('converts a publicKey to address', (): void => {
    expect(
      publicToAddr(
        hexToU8a(
          '0x836b35a026743e823a90a0ee3b91bf615c6a757e2b60b9e1dc1826fd0dd16106f7bc1e8179f665015f43c6c81f39062fc2086ed849625c06e04697698b21855e'
        )
      )
    ).toEqual('0x0BED7ABd61247635c1973eB38474A2516eD1D884');
  });
});
