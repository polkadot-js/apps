// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BehaviorSubject } from 'rxjs';
import { AddressInfo, AddressSubject } from './types';
import { KeyringJson } from '../types';

import store from 'store';

export default function genericSubject (keyCreator: (address: string) => string): AddressSubject {
  let current: AddressInfo = {};
  const subject = new BehaviorSubject({});

  return {
    add: (address: string, json: KeyringJson) => {
      current = { ...current };

      current[address] = json;

      store.set(keyCreator(address), json);
      subject.next(current);
    },
    remove: (address: string) => {
      current = { ...current };

      delete current[address];

      store.remove(keyCreator(address));
      subject.next(current);
    },
    subject
  };
}
