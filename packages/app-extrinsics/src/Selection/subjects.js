// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { EncodedParams, QueueTx } from '../types';
import type { Subjects } from './types';

import BN from 'bn.js';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import map from '@polkadot/extrinsics-substrate';

export default function createSubjects (): Subjects {
  return {
    index: new BehaviorSubject(new BN(0)),
    call: new BehaviorSubject(({
      isValid: false
    }: $Shape<QueueTx>)),
    method: new BehaviorSubject(({
      extrinsic: map.staking.methods.public.transfer,
      isValid: false
    }: $Shape<EncodedParams>)),
    sender: new BehaviorSubject(new Uint8Array([]))
  };
}
