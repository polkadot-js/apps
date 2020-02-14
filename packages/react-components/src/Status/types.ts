// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableResult } from '@polkadot/api';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { SignerResult } from '@polkadot/api/types';
import { RpcMethod } from '@polkadot/jsonrpc/types';
import { AccountId, Address } from '@polkadot/types/interfaces';
import { SignerPayloadJSON } from '@polkadot/types/types';

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

export type QueueTxStatus = 'future' | 'ready' | 'finalized' | 'finalitytimeout' | 'usurped' | 'dropped' | 'inblock' | 'invalid' | 'broadcast' | 'cancelled' | 'completed' | 'error' | 'incomplete' | 'queued' | 'qr' | 'retracted' | 'sending' | 'signing' | 'sent' | 'blocked';

export type SignerCallback = (id: number, result: SignerResult | null) => void;

export type TxCallback = (status: SubmittableResult) => void;

export type TxFailedCallback = (status: SubmittableResult | null) => void;

export interface QueueTx extends AccountInfo {
  error?: Error;
  extrinsic?: SubmittableExtrinsic;
  id: number;
  isUnsigned?: boolean;
  payload?: SignerPayloadJSON;
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
  payload?: SignerPayloadJSON;
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

export type QueueTxRpcAdd = (value: PartialQueueTxRpc) => void;

export type QueueTxExtrinsicAdd = (value: PartialQueueTxExtrinsic) => void;

export type QueueTxPayloadAdd = (payload: SignerPayloadJSON, signerCb: SignerCallback) => void;

export type QueueTxMessageSetStatus = (id: number, status: QueueTxStatus, result?: any, error?: Error) => void;

export type QueueAction$Add = (status: ActionStatus | ActionStatus[]) => void;

export interface QueueProps {
  stqueue: QueueStatus[];
  txqueue: QueueTx[];
  queueAction: QueueAction$Add;
  queueExtrinsic: QueueTxExtrinsicAdd;
  queuePayload: QueueTxPayloadAdd;
  queueRpc: QueueTxRpcAdd;
  queueSetTxStatus: QueueTxMessageSetStatus;
}
