// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableResult } from '@polkadot/api/SubmittableExtrinsic';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { RpcMethod } from '@polkadot/jsonrpc/types';
import { AccountId, Address } from '@polkadot/types';
import { SignatureOptions } from '@polkadot/types/types';

export type Actions = 'create' | 'edit' | 'restore' | 'forget' | 'backup' | 'changePassword' | 'transfer';

export type ActionStatus = {
  account?: AccountId | Address | string,
  action: Actions | string,
  message?: string,
  status: 'error' | 'event' | 'queued' | 'received' | 'success'
};

export type AccountInfo = {
  accountId?: string | null
};

export type QueueTxStatus = 'future' | 'ready' | 'finalized' | 'usurped' | 'dropped' | 'invalid' | 'broadcast' | 'cancelled' | 'completed' | 'error' | 'incomplete' | 'queued' | 'sending' | 'sent' | 'blocked';

export type SignerCallback = (id: number, isSigned: boolean) => void;

export type TxCallback = (status: SubmittableResult) => void;

export type TxFailedCallback = (status: SubmittableResult | null) => void;

export type QueueTx = AccountInfo & {
  error?: Error,
  extrinsic?: SubmittableExtrinsic,
  id: number,
  isUnsigned?: boolean,
  result?: any,
  removeItem: () => void,
  rpc: RpcMethod,
  signerCb?: SignerCallback,
  signerOptions?: SignatureOptions,
  txFailedCb?: TxFailedCallback,
  txSuccessCb?: TxCallback,
  txStartCb?: () => void,
  txUpdateCb?: TxCallback,
  values?: any[],
  status: QueueTxStatus
};

export type QueueStatus = ActionStatus & {
  id: number,
  isCompleted: boolean,
  removeItem: () => void
};

export type QueueTxResult = {
  error?: Error,
  result?: any,
  status: QueueTxStatus
};

export type QueueTxExtrinsic = AccountInfo & {
  extrinsic: SubmittableExtrinsic
};

export type QueueTxRpc = AccountInfo & {
  rpc: RpcMethod,
  values: any[]
};

export type PartialAccountInfo = {
  accountId?: string | null
};

export type PartialQueueTxExtrinsic = PartialAccountInfo & {
  extrinsic: SubmittableExtrinsic,
  signerCb?: SignerCallback,
  signerOptions?: SignatureOptions,
  txFailedCb?: TxFailedCallback,
  txSuccessCb?: TxCallback,
  txStartCb?: () => void,
  txUpdateCb?: TxCallback,
  isUnsigned?: boolean
};

export type PartialQueueTxRpc = PartialAccountInfo & {
  rpc: RpcMethod,
  values: any[]
};

export type QueueTxRpcAdd = (value: PartialQueueTxRpc) => number;

export type QueueTxExtrinsicAdd = (value: PartialQueueTxExtrinsic) => number;

export type QueueTxMessageSetStatus = (id: number, status: QueueTxStatus, result?: any, error?: Error) => void;

export type QueueAction$Add = (status: ActionStatus) => number;

export type QueueProps = {
  stqueue: Array<QueueStatus>,
  txqueue: Array<QueueTx>,
  queueAction: QueueAction$Add,
  queueExtrinsic: QueueTxExtrinsicAdd,
  queueRpc: QueueTxRpcAdd,
  queueSetTxStatus: QueueTxMessageSetStatus
};
