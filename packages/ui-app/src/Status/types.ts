// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableResult } from '@polkadot/api/SubmittableExtrinsic';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { SignerPayload, SignerResult } from '@polkadot/api/types';
import { RpcMethod } from '@polkadot/jsonrpc/types';
import { AccountId, Address } from '@polkadot/types/interfaces';

export type Actions = 'create' | 'edit' | 'restore' | 'forget' | 'backup' | 'changePassword' | 'transfer';

export interface ActionStatus {
  account?: AccountId | Address | string;
  action: Actions | string;
  message?: string;
  status: 'error' | 'event' | 'queued' | 'received' | 'success';
}

export interface AccountInfo {
  accountId?: string | null;
}

export type QueueTxStatus = 'future' | 'ready' | 'finalized' | 'usurped' | 'dropped' | 'invalid' | 'broadcast' | 'cancelled' | 'completed' | 'error' | 'incomplete' | 'queued' | 'sending' | 'sent' | 'blocked';

export type SignerCallback = (id: number, result: SignerResult | null) => void;

export type TxCallback = (status: SubmittableResult) => void;

export type TxFailedCallback = (status: SubmittableResult | null) => void;

export interface QueueTx extends AccountInfo {
  error?: Error;
  extrinsic?: SubmittableExtrinsic;
  id: number;
  isUnsigned?: boolean;
  payload?: SignerPayload;
  result?: any;
  removeItem: () => void;
  rpc: RpcMethod;
  signerCb?: SignerCallback;
  txFailedCb?: TxFailedCallback;
  txSuccessCb?: TxCallback;
  txStartCb?: () => void;
  txUpdateCb?: TxCallback;
  values?: any[];
  status: QueueTxStatus;
}

export interface QueueStatus extends ActionStatus {
  id: number;
  isCompleted: boolean;
  removeItem: () => void;
}

export interface QueueTxResult {
  error?: Error;
  result?: any;
  status: QueueTxStatus;
}

export interface QueueTxExtrinsic extends AccountInfo {
  extrinsic?: SubmittableExtrinsic;
}

export interface QueueTxRpc extends AccountInfo {
  rpc: RpcMethod;
  values: any[];
}

export interface PartialAccountInfo {
  accountId?: string | null;
}

export interface PartialQueueTxExtrinsic extends PartialAccountInfo {
  extrinsic?: SubmittableExtrinsic;
  payload?: SignerPayload;
  signerCb?: SignerCallback;
  txFailedCb?: TxFailedCallback;
  txSuccessCb?: TxCallback;
  txStartCb?: () => void;
  txUpdateCb?: TxCallback;
  isUnsigned?: boolean;
}

export interface PartialQueueTxRpc extends PartialAccountInfo {
  rpc: RpcMethod;
  values: any[];
}

export type QueueTxRpcAdd = (value: PartialQueueTxRpc) => number;

export type QueueTxExtrinsicAdd = (value: PartialQueueTxExtrinsic) => number;

export type QueueTxPayloadAdd = (payload: SignerPayload, signerCb: SignerCallback) => number;

export type QueueTxMessageSetStatus = (id: number, status: QueueTxStatus, result?: any, error?: Error) => void;

export type QueueAction$Add = (status: ActionStatus) => number;

export interface QueueProps {
  stqueue: QueueStatus[];
  txqueue: QueueTx[];
  queueAction: QueueAction$Add;
  queueExtrinsic: QueueTxExtrinsicAdd;
  queuePayload: QueueTxPayloadAdd;
  queueRpc: QueueTxRpcAdd;
  queueSetTxStatus: QueueTxMessageSetStatus;
}
