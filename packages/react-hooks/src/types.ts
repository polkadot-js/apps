// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { DeriveAccountFlags, DeriveAccountRegistration } from '@polkadot/api-derive/types';
import { ConstructTxFn, StringOrNull, VoidFn } from '@polkadot/react-components/types';
import { AccountId, Balance, BlockNumber, Call, Exposure, Hash, RewardDestination, SessionIndex, StakingLedger, ValidatorPrefs } from '@polkadot/types/interfaces';
import { IExtrinsic } from '@polkadot/types/types';
import { KeyringJson$Meta } from '@polkadot/ui-keyring/types';

export type CallParam = any;

export type CallParams = [] | CallParam[];

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
  isHardware: boolean;
  isInContacts: boolean;
  isInjected: boolean;
  isMultisig: boolean;
  isProxied: boolean;
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
  accountIndex?: string;
  flags: AddressFlags;
  name: string;
  setName: React.Dispatch<string>;
  tags: string[];
  setTags: React.Dispatch<string[]>;
  genesisHash: StringOrNull;
  identity?: AddressIdentity;
  isEditingName: boolean;
  meta?: KeyringJson$Meta;
  toggleIsEditingName: VoidFn;
  isEditingTags: boolean;
  isNull: boolean;
  toggleIsEditingTags: VoidFn;
  onSaveName: VoidFn;
  onSaveTags: VoidFn;
  onSetGenesisHash: (genesisHash: string | null) => void;
  onForgetAddress: VoidFn;
}

export interface StakerState {
  controllerId: string | null;
  destination?: RewardDestination;
  exposure?: Exposure;
  hexSessionIdNext: string | null;
  hexSessionIdQueue: string | null;
  isLoading: boolean;
  isOwnController: boolean;
  isOwnStash: boolean;
  isStashNominating: boolean;
  isStashValidating: boolean;
  nominating?: string[];
  sessionIds: string[];
  stakingLedger?: StakingLedger;
  stashId: string;
  validatorPrefs?: ValidatorPrefs;
}
