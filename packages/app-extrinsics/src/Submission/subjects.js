// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { EncodedParams, QueueTx } from '../types';

import BN from 'bn.js';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

type Subjects = {
  call: rxjs$BehaviorSubject<QueueTx>,
  index: rxjs$BehaviorSubject<BN>,
  method: rxjs$BehaviorSubject<EncodedParams>,
  sender: rxjs$BehaviorSubject<Uint8Array>
};

export default function createSubjects (): Subjects {
  const subjects = {
    index: new BehaviorSubject(new BN(0)),
    call: new BehaviorSubject(({ isValid: false }: $Shape<QueueTx>)),
    method: new BehaviorSubject(({ isValid: false }: $Shape<EncodedParams>)),
    sender: new BehaviorSubject(new Uint8Array([]))
  };

  const onChange = (): void => {
    const publicKey = subjects.sender.getValue();
    const message = subjects.method.getValue();
    const index = subjects.index.getValue();
    const isValid = !!(publicKey && publicKey.length && message && message.isValid);

    subjects.call.next({
      data: message.data,
      extrinsic: message.extrinsic,
      isValid,
      index,
      publicKey,
      status: 'incomplete'
    });
  };

  subjects.method.subscribe(onChange);
  subjects.sender.subscribe(onChange);

  return subjects;
}
