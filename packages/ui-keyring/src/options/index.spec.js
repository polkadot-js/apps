// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { initOptions } from './index';

describe('initOptions', () => {
  it('should not allow initOptions to be called more than once', () => {
    // first call
    initOptions();

    // second call
    expect(() => {
      initOptions();
    }).toThrowError('Unable to initialise options more than once');  
  });
});