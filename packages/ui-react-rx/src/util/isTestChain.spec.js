// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import isTestChain from './isTestChain';

describe('check chain spec to configure keyring test mode and dev accounts availability', () => {
  it('enables test environment when chain specification matches text of dev or loc(al)', () => {
    const validTestModeChainSpecsWithDev = ['Development disorder', 'my development', 'a devotion to'];
    const validTestModeChainSpecsWithLoc = ['Local beer', 'one local beer', 'one good locust'];

    for (let s of validTestModeChainSpecsWithDev.concat(validTestModeChainSpecsWithLoc)) {
      expect(isTestChain(s)).toEqual(true);
    }
  });

  it('disables keyring test mode when chain specification is not a test mode or undefined or number type', () => {
    const invalidTestModeChainSpecs = ['PoC-1 Testnet', 'Staging Testnet', 'future PoC-2 Testnet', 'a pocadot?', undefined, 0];

    for (let s of invalidTestModeChainSpecs) {
      expect(isTestChain(s)).toEqual(false);
    }
  });
});
