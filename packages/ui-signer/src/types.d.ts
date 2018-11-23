// Copyright 2017-2018 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import { RpcMethod } from '@polkadot/jsonrpc/types';
import { UInt } from '@polkadot/types/codec';
import { Hash, Extrinsic } from '@polkadot/types';
import { Extrinsics } from '@polkadot/types/Method';
import { RawParam$Value } from '@polkadot/ui-app/Params/types';

export type AccountInfo = {
  accountId?: string | null,
  accountNonce: BN
};

export type QueueTx$Status = 'finalised' | 'usurped' | 'dropped' | 'broadcast' | 'cancelled' | 'completed' | 'error' | 'incomplete' | 'queued' | 'sending' | 'sent' | 'blocked';

export type QueueTx$Id = number;

export type QueueTx = AccountInfo & {
  error?: Error,
  extrinsic?: Extrinsic,
  id: QueueTx$Id,
  result?: any,
  rpc: RpcMethod,
  values?: Array<any>,
  status: QueueTx$Status
};

export type QueueTx$Result = {
  error?: Error,
  result?: any,
  status: QueueTx$Status
};

export type QueueTx$Extrinsic = AccountInfo & {
  extrinsic: Extrinsic
};

export type QueueTx$Rpc = AccountInfo & {
  rpc: RpcMethod,
  values: Array<any>
};

export type PartialAccountInfo = {
  accountId?: string | null,
  accountNonce?: BN | null
};

export type PartialQueueTx$Extrinsic = PartialAccountInfo & {
  extrinsic: Extrinsic
};

export type PartialQueueTx$Rpc = PartialAccountInfo & {
  rpc: RpcMethod,
  values: Array<any>
};

export type QueueTx$RpcAdd = (value: PartialQueueTx$Rpc) => QueueTx$Id;

export type QueueTx$ExtrinsicAdd = (value: PartialQueueTx$Extrinsic) => QueueTx$Id;

export type QueueTx$MessageSetStatus = (id: number, status: QueueTx$Status, result?: any, error?: Error) => void;

export type QueueTx$Unclog = (accountNonce: BN) => void;

export type QueueProps = {
  queue: Array<QueueTx>,
  queueUnclog: QueueTx$Unclog,
  queueExtrinsic: QueueTx$ExtrinsicAdd,
  queueRpc: QueueTx$RpcAdd,
  queueSetStatus: QueueTx$MessageSetStatus
};

export type Signed = {
  data: Uint8Array,
  message: Uint8Array,
  signature: Uint8Array
};
