// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { RxApiInterface } from '@polkadot/rx-api/types';
import type { QueueTx } from '../types';

import encodeCall from '@polkadot/extrinsics-codec/src/encode/call';
import u8aConcat from '@polkadot/util/u8a/concat';
import u8aToHex from '@polkadot/util/u8a/toHex';

import keyring from '../keyring';

export default function submit (api: RxApiInterface, tx: QueueTx, subject: rxjs$BehaviorSubject<QueueTx>): Promise<void> {
  const message = encodeCall(tx.publicKey, tx.index, tx.data);
  const signature = keyring.getPair(tx.publicKey).sign(message);

  console.log('submitExtrinsic: message =', u8aToHex(message));
  console.log('submitExtrinsic: signature =', u8aToHex(signature));

  return api.author
    .submitExtrinsic(u8aConcat(message, signature))
    .toPromise()
    .then((result) => {
      console.log('submitExtrinsic: result=', result);

      subject.next({
        ...tx,
        status: 'sent'
      });
    })
    .catch((error) => {
      console.error('submitExtrinsic: error=', error);

      subject.next({
        ...tx,
        status: 'error'
      });
    });
}
