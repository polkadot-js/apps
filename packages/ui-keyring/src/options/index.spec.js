// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import keyringOptionInstance from './index';

describe('KeyringOption', () => {
  it('should not allow initOptions to be called more than once', () => {
    const state = {};
    // first call
    keyringOptionInstance.init(state);

    // second call
    expect(() => {
      keyringOptionInstance.init(state);
    }).toThrowError('Unable to initialise options more than once');
  });
});
