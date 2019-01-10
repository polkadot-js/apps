// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import SubmittableExtrinsic from '@polkadot/api/promise/SubmittableExtrinsic';
import { RpcMethod } from '@polkadot/jsonrpc/types';
import { AccountId, Address } from '@polkadot/types';

export type Actions = 'create' | 'edit' | 'restore' | 'forget' | 'backup' | 'changePassword' | 'transfer';

export type ActionStatus = {
  account?: AccountId | Address | string,
  action: Actions | string,
  message?: string,
  status: 'error' | 'event' | 'queued' | 'received' | 'success'
};

export type AccountInfo = {
  accountId?: string | null,
  accountNonce: BN
};

export type QueueTx$Status = 'future' | 'ready' | 'finalised' | 'usurped' | 'dropped' | 'invalid' | 'broadcast' | 'cancelled' | 'completed' | 'error' | 'incomplete' | 'queued' | 'sending' | 'sent' | 'blocked';

export type QueueTx = AccountInfo & {
  error?: Error,
  extrinsic?: SubmittableExtrinsic,
  id: number,
  isUnsigned?: boolean,
  result?: any,
  rpc: RpcMethod,
  values?: Array<any>,
  status: QueueTx$Status
};

export type QueueStatus = ActionStatus & {
  id: number,
  isCompleted: boolean
};

export type QueueTx$Result = {
  error?: Error,
  result?: any,
  status: QueueTx$Status
};

export type QueueTx$Extrinsic = AccountInfo & {
  extrinsic: SubmittableExtrinsic
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
  extrinsic: SubmittableExtrinsic,
  isUnsigned?: boolean
};

export type PartialQueueTx$Rpc = PartialAccountInfo & {
  rpc: RpcMethod,
  values: Array<any>
};

export type QueueTx$RpcAdd = (value: PartialQueueTx$Rpc) => number;

export type QueueTx$ExtrinsicAdd = (value: PartialQueueTx$Extrinsic) => number;

export type QueueTx$MessageSetStatus = (id: number, status: QueueTx$Status, result?: any, error?: Error) => void;

export type QueueTx$Unclog = (accountNonce: BN) => void;

export type QueueAction$Add = (status: ActionStatus) => number;

export type QueueProps = {
  stqueue: Array<QueueStatus>,
  txqueue: Array<QueueTx>,
  queueAction: QueueAction$Add,
  queueUnclog: QueueTx$Unclog,
  queueExtrinsic: QueueTx$ExtrinsicAdd,
  queueRpc: QueueTx$RpcAdd,
  queueSetTxStatus: QueueTx$MessageSetStatus
};
