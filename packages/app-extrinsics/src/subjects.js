// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import BN from 'bn.js';

export const extrinsicName = new BehaviorSubject();
export const recipientAddr = new BehaviorSubject();
export const senderAddr = new BehaviorSubject();
export const senderIndex = new BehaviorSubject(new BN(0));
