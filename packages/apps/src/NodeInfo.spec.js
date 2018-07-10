// Copyright 2017-2018 @polkadot/ui-identicon authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { updateTestInfo } from './NodeInfo';

describe('configure keyring test mode and dev accounts availability', () => {
  it('enables test environment when chain specification matches text of dev or loc(al)', () => {
    expect(updateTestInfo('Development')).toEqual(true);
    expect(updateTestInfo(' development')).toEqual(true);
    expect(updateTestInfo('dev')).toEqual(true);
    expect(updateTestInfo('Local')).toEqual(true);
    expect(updateTestInfo(' local ')).toEqual(true);
    expect(updateTestInfo('loc')).toEqual(true);
  });

  it('disables keyring test mode when chain specification is undefined', () => {
    expect(updateTestInfo(undefined)).toEqual(false);
  });

  it('disables keyring test mode when chain specification is not a test mode', () => {
    expect(updateTestInfo('PoC-1 Testnet')).toEqual(false);
    expect(updateTestInfo('PoC-2 Testnet')).toEqual(false);
    expect(updateTestInfo('')).toEqual(false);
  });
});
