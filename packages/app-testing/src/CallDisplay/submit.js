// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { RxApiInterface } from '@polkadot/rx-api/types';

import encode from '../encode';
import extrinsics from '../extrinsics';
import keyring from '../keyring';
import { senderAddr, senderIndex } from '../subjects';

export default function submit (api: RxApiInterface, method: string, values: Array<mixed>): Promise<void> {
  // TODO: Handle result
  // TODO: Display some progress
  api.author
    .submitExtrinsic(
      encode(
        extrinsics[method],
        keyring.getPair(senderAddr.getValue()),
        senderIndex.getValue(),
        values
      )
    )
    .toPromise()
    .then((result) => {
      console.error('submitExtrinsic', result);
    })
    .catch((error) => {
      console.error('submitExtrinsic', error);
    });
}
