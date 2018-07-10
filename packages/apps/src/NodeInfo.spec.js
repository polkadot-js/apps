// Copyright 2017-2018 @polkadot/ui-identicon authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { isTestChain } from './NodeInfo';

describe('check chain spec to configure keyring test mode and dev accounts availability', () => {
  it('enables test environment when chain specification matches text of dev or loc(al)', () => {
    expect(isTestChain('Development')).toEqual(true);
    expect(isTestChain(' development')).toEqual(true);
    expect(isTestChain('dev')).toEqual(true);
    expect(isTestChain('Local')).toEqual(true);
    expect(isTestChain(' local ')).toEqual(true);
    expect(isTestChain('loc')).toEqual(true);
  });

  it('disables keyring test mode when chain specification is undefined', () => {
    expect(isTestChain(undefined)).toEqual(false);
  });

  it('disables keyring test mode when chain specification is not a test mode', () => {
    expect(isTestChain('PoC-1 Testnet')).toEqual(false);
    expect(isTestChain('PoC-2 Testnet')).toEqual(false);
    expect(isTestChain('')).toEqual(false);
  });
});
