// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { RxApiInterface } from '@polkadot/rx-api/types';

import encode from '../encode';
import extrinsics from '../extrinsics';
import keyring from '../keyring';
import { senderAddr, senderIndex } from '../subjects';

import sign from './sign';

export default function submit (api: RxApiInterface, method: string, values: Array<mixed>): void {
  // flowlint-next-line unclear-type:off
  const publicKey = ((senderAddr.getValue(): any): Uint8Array);

  api.author
    .submitExtrinsic(
      sign(
        keyring.getPair(publicKey),
        encode(
          extrinsics[method],
          publicKey,
          senderIndex.getValue() || 0,
          values
        )
      )
    )
    .toPromise()
    .then((result) => {
      console.log('submitExtrinsic: result=', result);
    })
    .catch((error) => {
      console.error('submitExtrinsic: error=', error);
    });
}
