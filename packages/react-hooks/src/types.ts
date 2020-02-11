// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ConstructTxFn, StringOrNull } from '@polkadot/react-components/types';
import { AccountId, Balance, BlockNumber, Call, Hash, SessionIndex } from '@polkadot/types/interfaces';
import { IExtrinsic } from '@polkadot/types/types';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';

export type CallParam = any;

export type CallParams = [] | [CallParam] | [CallParam, CallParam] | [CallParam, CallParam, CallParam];

export interface CallOptions <T> {
  defaultValue?: T;
  isSingle?: boolean;
  paramMap?: (params: any) => CallParams;
  transform?: (value: any) => T;
}

export type TxDef = [string, any[] | ConstructTxFn];

export type TxDefs = SubmittableExtrinsic | IExtrinsic | Call | TxDef | null;

export type TxSource<T extends TxDefs> = [T, boolean];

export interface ModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export interface Slash {
  accountId: AccountId;
  amount: Balance;
}

export interface SessionRewards {
  blockHash: Hash;
  blockNumber: BlockNumber;
  isEventsEmpty: boolean;
  reward: Balance;
  sessionIndex: SessionIndex;
  slashes: Slash[];
}

export interface ExtrinsicAndSenders {
  extrinsic: SubmittableExtrinsic | null;
  isSubmittable: boolean;
  sendTx: () => void;
  sendUnsigned: () => void;
}

export interface TxProps {
  accountId?: StringOrNull;
  onChangeAccountId?: (_: StringOrNull) => void;
  onSuccess?: () => void;
  onFailed?: () => void;
  onStart?: () => void;
  onUpdate?: () => void;
}

export interface TxState extends ExtrinsicAndSenders {
  isSending: boolean;
  accountId?: StringOrNull;
  onChangeAccountId: (_: StringOrNull) => void;
}
