// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

export type Subjects = {
  call: rxjs$BehaviorSubject<QueueTx>,
  index: rxjs$BehaviorSubject<BN>,
  method: rxjs$BehaviorSubject<EncodedParams>,
  sender: rxjs$BehaviorSubject<Uint8Array>
};
