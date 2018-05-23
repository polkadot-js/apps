// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type BN from 'bn.js';
import type { Extrinsic } from '@polkadot/extrinsics/types';

export type EncodedMessage = {
  isValid: boolean,
  value: Uint8Array
};

export type QueueTx$Status = 'cancelled' | 'completed' | 'error' | 'incomplete' | 'queued' | 'sending' | 'sent';

export type QueueTx$Id = number;

export type QueueTx$Extrinsic = EncodedMessage & {
  extrinsic: Extrinsic,
  nonce: BN,
  publicKey: Uint8Array
}

export type QueueTx$Base = QueueTx$Extrinsic;

export type QueueTx = QueueTx$Base & {
  id: QueueTx$Id,
  status: QueueTx$Status
};

export type QueueTx$MessageAdd = (value: QueueTx$Base) => QueueTx$Id;

export type QueueTx$MessageSetStatus = (id: number, status: QueueTx$Status) => void;

export type QueueProps = {
  queue: Array<QueueTx>,
  queueAdd: QueueTx$MessageAdd,
  queueSetStatus: QueueTx$MessageSetStatus
};

export type QueueTx$Result = {
  result: mixed,
  status: QueueTx$Status
}

export type Signed = {
  data: Uint8Array,
  message: Uint8Array,
  signature: Uint8Array
};
