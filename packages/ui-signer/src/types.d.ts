// Copyright 2017-2018 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import BN from 'bn.js';
import { Base, UInt } from '@polkadot/types/codec';
import { Hash, UncheckedMortalExtrinsic } from '@polkadot/types';
import { Extrinsics } from '@polkadot/extrinsics/types';
import { Method } from '@polkadot/jsonrpc/types';
import { RawParam$Value } from '@polkadot/ui-app/Params/types';

export type QueueTx$Status = 'cancelled' | 'completed' | 'error' | 'incomplete' | 'queued' | 'sending' | 'sent';

export type QueueTx$Id = number;

export type QueueTx$Result = {
  error?: Error,
  result?: any,
  status: QueueTx$Status
}

export type AccountInfo = {
  accountNonce: UInt | BN,
  publicKey?: Uint8Array | null
};

export type QueueTx$Extrinsic = AccountInfo & {
  extrinsic: UncheckedMortalExtrinsic
}

export type QueueTx = QueueTx$Extrinsic & {
  error?: Error,
  id: QueueTx$Id,
  result?: any,
  status: QueueTx$Status
};

export type QueueTx$MessageAdd = (value: QueueTx$Extrinsic) => QueueTx$Id;

export type QueueTx$ExtrinsicAdd = (value: QueueTx$Extrinsic) => QueueTx$Id;

export type QueueTx$MessageSetStatus = (id: number, status: QueueTx$Status, result?: any, error?: Error) => void;

export type QueueProps = {
  queue: Array<QueueTx>,
  queueAdd: QueueTx$MessageAdd,
  queueExtrinsic: QueueTx$ExtrinsicAdd,
  queueSetStatus: QueueTx$MessageSetStatus
};

export type Signed = {
  data: Uint8Array,
  message: Uint8Array,
  signature: Uint8Array
};
