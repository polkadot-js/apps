// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { KeyringPair } from '@polkadot/uti-keyring/types';

import { map } from 'rxjs/operators/map';
import { ReplaySubject } from 'rxjs/ReplaySubject';

export default function addr (): $rxjs$ReplaySubject {
  return new ReplaySubject(1).pipe(
    map((pair: KeyringPair) => {
      if (!pair) {
        return new Uint8Array([]);
      }

      return pair.publicKey();
    })
  );
}
