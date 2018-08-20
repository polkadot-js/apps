// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BehaviorSubject } from 'rxjs';
import { SubjectInfo, AddressSubject, SingleAddress } from './types';
import { KeyringJson } from '../types';

import store from 'store';

import createOptionItem from '../options/item';

export default function genericSubject (keyCreator: (address: string) => string): AddressSubject {
  let current: SubjectInfo = {};
  const subject = new BehaviorSubject({});

  return {
    add: (address: string, json: KeyringJson): SingleAddress => {
      current = { ...current };

      current[address] = {
        json,
        option: createOptionItem(address, json.meta.name)
      };

      store.set(keyCreator(address), json);
      subject.next(current);

      return current[address];
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
