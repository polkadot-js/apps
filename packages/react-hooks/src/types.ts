// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveAccountFlags, DeriveAccountRegistration } from '@polkadot/api-derive/types';
import { ConstructTxFn, StringOrNull, VoidFn } from '@polkadot/react-components/types';
import { AccountId, Balance, BlockNumber, Call, Hash, SessionIndex } from '@polkadot/types/interfaces';
import { IExtrinsic } from '@polkadot/types/types';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';

export type CallParam = any;

export type CallParams = [] | [CallParam] | [CallParam, CallParam] | [CallParam, CallParam, CallParam] | any[];

export interface CallOptions <T> {
  defaultValue?: T;
  isSingle?: boolean;
  paramMap?: (params: any) => CallParams;
  transform?: (value: any) => T;
  withParams?: boolean;
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

export interface UseSudo {
  allAccounts: string[];
  sudoKey?: string;
  isMine: boolean;
}

export interface AddressFlags extends DeriveAccountFlags {
  isDevelopment: boolean;
  isEditable: boolean;
  isExternal: boolean;
  isFavorite: boolean;
  isInContacts: boolean;
  isMultisig: boolean;
  isOwned: boolean;
}

export interface AddressIdentity extends DeriveAccountRegistration {
  isGood: boolean;
  isBad: boolean;
  isKnownGood: boolean;
  isReasonable: boolean;
  isErroneous: boolean;
  isLowQuality: boolean;
  isExistent: boolean;
  waitCount: number;
}

export interface UseAccountInfo {
  flags: AddressFlags;
  name: string;
  setName: React.Dispatch<string>;
  tags: string[];
  setTags: React.Dispatch<string[]>;
  genesisHash: StringOrNull;
  setGenesisHash: React.Dispatch<StringOrNull>;
  identity?: AddressIdentity;
  isEditingName: boolean;
  toggleIsEditingName: VoidFn;
  isEditingTags: boolean;
  toggleIsEditingTags: VoidFn;
  onSaveName: VoidFn;
  onSaveTags: VoidFn;
  onSaveGenesisHash: VoidFn;
  onForgetAddress: VoidFn;
}
