// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Keyring } from './index';

describe('Keyring', () => {
  /* eslint-disable */
  it('should create singleton instance so multiple instances cannot be created', () => {
    const firstKeyringInstance = new Keyring();
    const secondKeyringInstance = new Keyring();

    expect(Keyring.counter).toBe(1);
  });
  /* eslint-enable */

  it('should not allow initOptions to be called again after importing keyring singleton instance', () => {
    const firstKeyringInstance = new Keyring();
    firstKeyringInstance.loadAll();

    expect(() => {
      firstKeyringInstance.loadAll();
    }).toThrowError('Unable to initialise options more than once');  
  });
});