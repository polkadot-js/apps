// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import encode from '../encode';
import extrinsics from '../extrinsics';
import { senderAddr, senderIndex, queueTx } from '../subjects';

export default function queue (method: string, values: Array<mixed>): void {
  // flowlint-next-line unclear-type:off
  const publicKey = ((senderAddr.getValue(): any): Uint8Array);
  const message = encode(
    extrinsics.get(method),
    publicKey,
    senderIndex.getValue() || 0,
    values
  );

  queueTx.next({
    message,
    method,
    publicKey
  });
}
