// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic } from '../extrinsics/types';

import encode from '../encode';
import { senderAddr, senderIndex, queueTx } from '../subjects';

export default function queue (extrinsic: Extrinsic, values: Array<mixed>): void {
  // flowlint-next-line unclear-type:off
  const publicKey = ((senderAddr.getValue(): any): Uint8Array);
  const message = encode(
    extrinsic,
    publicKey,
    senderIndex.getValue() || 0,
    values
  );

  queueTx.next({
    message,
    method: extrinsic.name,
    publicKey
  });
}
