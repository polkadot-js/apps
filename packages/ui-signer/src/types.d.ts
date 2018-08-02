// Copyright 2017-2018 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import BN from 'bn.js';
import { Extrinsics } from '@polkadot/extrinsics/types';
import { SectionItem } from '@polkadot/params/types';
import { Interfaces } from '@polkadot/jsonrpc/types';
import { Param$Values } from '@polkadot/params/types';
import { RawParam$Value } from '@polkadot/ui-app/Params/types';

export type EncodedMessage = {
  isValid: boolean,
  values: Array<Param$Values>
};

export type QueueTx$Status = 'cancelled' | 'completed' | 'error' | 'incomplete' | 'queued' | 'sending' | 'sent';

export type QueueTx$Id = number;

export type QueueTx$Result = {
  error?: Error,
  result?: any,
  status: QueueTx$Status
}

export type AccountInfo = {
  nonce: BN,
  publicKey?: Uint8Array | null
};

export type QueueTx$Base = EncodedMessage & AccountInfo & {
  rpc: SectionItem<Interfaces>
};

export type QueueTx$Extrinsic = AccountInfo & {
  extrinsic: SectionItem<Extrinsics>,
  values: Array<RawParam$Value>
}

export type QueueTx = QueueTx$Base & {
  error?: Error,
  id: QueueTx$Id,
  result?: any,
  status: QueueTx$Status
};

export type QueueTx$MessageAdd = (value: QueueTx$Base) => QueueTx$Id;

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
