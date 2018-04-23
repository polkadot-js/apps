// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { RxApiInterface } from '@polkadot/rx-api/types';

import keyring from '../keyring';

import sign from './sign';

export default function submit (api: RxApiInterface, publicKey: Uint8Array, message: Uint8Array): Promise<void> {
  return api.author
    .submitExtrinsic(
      sign(
        keyring.getPair(publicKey),
        message
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
