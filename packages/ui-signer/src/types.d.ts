
import BN from 'bn.js';
import { Extrinsics } from '@polkadot/extrinsics/types';
import { RpcMethod } from '@polkadot/jsonrpc/types';
import { Base, UInt } from '@polkadot/types/codec';
import { Hash, Extrinsic } from '@polkadot/types';
import { RawParam$Value } from '@polkadot/ui-app/Params/types';

export type QueueTx$Status = 'cancelled' | 'completed' | 'error' | 'incomplete' | 'queued' | 'sending' | 'sent';

export type QueueTx$Id = number;

export type QueueTx$Result = {
  error?: Error,
  result?: any,
  status: QueueTx$Status
};

export type QueueTx$Extrinsic = AccountInfo & {
  extrinsic: Extrinsic
}

export type QueueTx$Rpc = AccountInfo & {
  rpc: RpcMethod,
  values: Array<any>
};

export type QueueTx = AccountInfo & {
  error?: Error,
  extrinsic?: Extrinsic,
  id: QueueTx$Id,
  result?: any,
  rpc: RpcMethod,
  values?: Array<any>,
  status: QueueTx$Status
};

export type QueueTx$Add = (value: QueueTx$Rpc | QueueTx$Extrinsic) => QueueTx$Id;

export type QueueTx$RpcAdd = (value: QueueTx$Rpc) => QueueTx$Id;

export type QueueTx$ExtrinsicAdd = (value: QueueTx$Extrinsic) => QueueTx$Id;

export type QueueTx$MessageSetStatus = (id: number, status: QueueTx$Status, result?: any, error?: Error) => void;

export type QueueProps = {
  queue: Array<QueueTx>,
  queueExtrinsic: QueueTx$ExtrinsicAdd,
  queueRpc: QueueTx$RpcAdd,
  queueSetStatus: QueueTx$MessageSetStatus
};

export type Signed = {
  data: Uint8Array,
  message: Uint8Array,
  signature: Uint8Array
};
