// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringStruct } from '../types';
import { SingleAddress } from '../observable/types';
import { KeyringOptions, KeyringOptionInstance, KeyringSectionOption, KeyringSectionOptions } from './types';

import { BehaviorSubject } from 'rxjs';

import observableAll from '../observable';

let hasCalledInitOptions = false;

class KeyringOption implements KeyringOptionInstance {
  optionsSubject: BehaviorSubject<KeyringOptions> = new BehaviorSubject(this.emptyOptions());

  createOptionHeader (name: string): KeyringSectionOption {
    return {
      className: 'header disabled',
      name,
      key: `header-${name.toLowerCase()}`,
      text: name,
      value: null
    };
  }

  init (keyring: KeyringStruct): void {
    if (hasCalledInitOptions) {
      throw new Error('Unable to initialise options more than once');
    }

    observableAll.subscribe((value) => {
      const options = this.emptyOptions();

      this.addAccounts(keyring, options);
      this.addAddresses(keyring, options);

      options.address = ([] as KeyringSectionOptions).concat(
        options.address.length ? [ this.createOptionHeader('Addresses') ] : [],
        options.address,
        options.recent.length ? [ this.createOptionHeader('Recent') ] : [],
        options.recent
      );
      options.account = ([] as KeyringSectionOptions).concat(
        options.account.length ? [ this.createOptionHeader('Accounts') ] : [],
        options.account,
        options.testing.length ? [ this.createOptionHeader('Development') ] : [],
        options.testing
      );

      options.all = ([] as KeyringSectionOptions).concat(
        options.account,
        options.address
      );

      this.optionsSubject.next(options);
    });

    hasCalledInitOptions = true;
  }

  private addAccounts (keyring: KeyringStruct, options: KeyringOptions): void {
    const available = keyring.accounts.subject.getValue();

    Object
      .keys(available)
      .map((address) =>
        available[address]
      )
      .forEach(({ json: { meta: { isTesting = false } }, option }: SingleAddress) => {
        if (!isTesting) {
          options.account.push(option);
        } else {
          options.testing.push(option);
        }
      });
  }

  private addAddresses (keyring: KeyringStruct, options: KeyringOptions): void {
    const available = keyring.addresses.subject.getValue();

    Object
      .keys(available)
      .map((address) =>
        available[address]
      )
      .forEach(({ json: { meta: { isRecent = false } }, option }: SingleAddress) => {
        if (isRecent) {
          options.recent.push(option);
        } else {
          options.address.push(option);
        }
      });
  }

  private emptyOptions (): KeyringOptions {
    return {
      account: [],
      address: [],
      all: [],
      recent: [],
      testing: []
    };
  }
}

const keyringOptionInstance = new KeyringOption();

export default keyringOptionInstance;
