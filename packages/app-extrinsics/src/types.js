// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type BN from 'bn.js';
import type { Extrinsic } from '@polkadot/extrinsics/types';

export type EncodedMessage = {
  extrinsic: Extrinsic,
  isValid: boolean,
  value: Uint8Array
};

export type QueueTx$Status = 'cancelled' | 'completed' | 'error' | 'incomplete' | 'queued' | 'sent';

export type QueueTx = EncodedMessage & {
  id: number,
  nonce: BN,
  publicKey: Uint8Array,
  status: QueueTx$Status
};
