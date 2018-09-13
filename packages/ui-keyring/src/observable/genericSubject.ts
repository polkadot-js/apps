// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BehaviorSubject } from 'rxjs';
import { SubjectInfo, AddressSubject, SingleAddress } from './types';
import { KeyringJson } from '../types';

import store from 'store';

import createOptionItem from '../options/item';
import development from './development';

export default function genericSubject (keyCreator: (address: string) => string, withTest: boolean = false): AddressSubject {
  let current: SubjectInfo = {};
  const subject = new BehaviorSubject({});
  const next = (): void => {
    const isDevMode = development.isDevelopment();

    subject.next(
      Object
        .keys(current)
        .reduce((filtered, key) => {
          const { json: { meta: { isTesting = false } = {} } = {} } = current[key];

          if (!withTest || isDevMode || isTesting !== true) {
            filtered[key] = current[key];
          }

          return filtered;
        }, {} as SubjectInfo)
    );
  };

  development.subject.subscribe(next);

  return {
    add: (address: string, json: KeyringJson): SingleAddress => {
      current = { ...current };

      current[address] = {
        json,
        option: createOptionItem(address, json.meta.name)
      };

      store.set(keyCreator(address), json);
      next();

      return current[address];
    },
    remove: (address: string) => {
      current = { ...current };

      delete current[address];

      store.remove(keyCreator(address));
      next();
    },
    subject
  };
}
