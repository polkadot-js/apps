// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BehaviorSubject } from 'rxjs';
import { KeyringJson } from '../types';

export type AddressInfo = {
  [index: string]: KeyringJson
};

export type AddressSubject = {
  add: (address: string, json: KeyringJson) => void,
  subject: BehaviorSubject<AddressInfo>
};
