// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { RxApiInterface } from '@polkadot/rx-api/types';
import type { QueueTx } from '../types';

import encodeCall from '@polkadot/extrinsics-codec/encode/call';
import keyring from '@polkadot/ui-react-app/src/keyring';
import u8aConcat from '@polkadot/util/u8a/concat';
import u8aToHex from '@polkadot/util/u8a/toHex';

export default function submit (api: RxApiInterface, { nonce, publicKey, value }: QueueTx): Promise<string> {
  const message = encodeCall(publicKey, nonce, value);
  const signature = keyring.getPair(publicKey).sign(message);

  console.log('submitExtrinsic: message =', u8aToHex(message));
  console.log('submitExtrinsic: signature =', u8aToHex(signature));

  return api.author
    .submitExtrinsic(u8aConcat(message, signature))
    .toPromise()
    .then((result) => {
      console.log('submitExtrinsic: result=', result);

      return 'sent';
    })
    .catch((error) => {
      console.error('submitExtrinsic: error=', error);

      return 'error';
    });
}
