// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { RxApiInterface } from '@polkadot/rx-api/types';
import type { QueueTx } from '../types';

import encodeCall from '../encode/call';
import keyring from '../keyring';

import sign from './sign';

export default function submit (api: RxApiInterface, tx: QueueTx, subject: rxjs$BehaviorSubject<QueueTx>): Promise<void> {
  return api.author
    .submitExtrinsic(
      sign(
        keyring.getPair(tx.publicKey),
        encodeCall(tx.publicKey, tx.index, tx.data)
      )
    )
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
