// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BehaviorSubject } from 'rxjs';
import { AddressInfo, AddressSubject } from './types';
import { KeyringJson } from '../types';

export default function genericSubject (): AddressSubject {
  let current: AddressInfo = {};
  const subject = new BehaviorSubject({});

  return {
    add: (address: string, json: KeyringJson) => {
      current = { ...current, [address]: json };

      subject.next(current);
    },
    subject
  };
}
