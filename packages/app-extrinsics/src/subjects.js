// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic } from './extrinsics/types';
import type { QueueTx } from './types';

import BN from 'bn.js';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export const extrinsic: rxjs$BehaviorSubject<?Extrinsic> = new BehaviorSubject();
export const queueTx: rxjs$BehaviorSubject<?QueueTx> = new BehaviorSubject();
export const senderAddr: rxjs$BehaviorSubject<?Uint8Array> = new BehaviorSubject();
export const senderIndex: rxjs$BehaviorSubject<BN> = new BehaviorSubject(new BN(0));
