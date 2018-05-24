// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type BN from 'bn.js';
import type { Interface$Method } from '@polkadot/jsonrpc/types';
import type { Param$Values } from '@polkadot/params/types';

export type EncodedMessage = {
  isValid: boolean,
  values: Array<Param$Values>
};

export type QueueTx$Status = 'cancelled' | 'completed' | 'error' | 'incomplete' | 'queued' | 'sending' | 'sent';

export type QueueTx$Id = number;

export type QueueTx$Result = {
  error?: Error,
  result?: mixed,
  status: QueueTx$Status
}

export type QueueTx$Base = EncodedMessage & {
  rpc: Interface$Method,
  nonce: BN,
  publicKey?: Uint8Array | null
};

export type QueueTx = QueueTx$Base & {
  error?: Error,
  id: QueueTx$Id,
  result?: mixed,
  status: QueueTx$Status
};

export type QueueTx$MessageAdd = (value: QueueTx$Base) => QueueTx$Id;

export type QueueTx$MessageSetStatus = (id: number, status: QueueTx$Status, result?: mixed, error?: Error) => void;

export type QueueProps = {
  queue: Array<QueueTx>,
  queueAdd: QueueTx$MessageAdd,
  queueSetStatus: QueueTx$MessageSetStatus
};

export type Signed = {
  data: Uint8Array,
  message: Uint8Array,
  signature: Uint8Array
};
