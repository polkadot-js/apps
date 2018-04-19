// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { RxApiInterface } from '@polkadot/rx-api/types';

import encode from '../encode';
import extrinsics from '../extrinsics';
import keyring from '../keyring';
import { senderAddr, senderIndex } from '../subjects';

export default function submit (api: RxApiInterface, method: string, values: Array<mixed>): void {
  // TODO: Display some progress once we have a subscription
  api.author
    .submitExtrinsic(
      encode(
        extrinsics[method],
        // flowlint-next-line unclear-type:off
        keyring.getPair(((senderAddr.getValue(): any): Uint8Array)),
        senderIndex.getValue() || 0,
        values
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
