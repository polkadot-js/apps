// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import shouldUseLatestChain from './shouldUseLatestChain';

describe('check chain spec to configure encoding', () => {
  it('enables PoC-1 encoding when chain specification is PoC-1 or undefined', () => {
    let validChainSpecWithPoC1 = ['try poc-1 now', 'testing PoC-1 Testnet'];
    const validChainSpecWithUndefinedOrNumber = [undefined];

    for (let s of validChainSpecWithPoC1.concat(validChainSpecWithUndefinedOrNumber)) {
      expect(shouldUseLatestChain(s)).toEqual(false);
    }
  });

  it('enables Latest encoding when chain specification is NOT PoC-1 or undefined', () => {
    const invalidChainSpecWithoutPoC1OrUndefined = ['poc-2', 'PoC-2 Testnet', 'staging',
      'Staging Testnet', 'Local', 'Development', ' development', 'dev', 'Local', ' local ', 'loc', 0];

    for (let s of invalidChainSpecWithoutPoC1OrUndefined) {
      expect(shouldUseLatestChain(s)).toEqual(true);
    }
  });
});
