// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { DeriveAccountFlags, DeriveAccountRegistration } from '@polkadot/api-derive/types';
import type { DisplayedJudgement } from '@polkadot/react-components/types';
import type { AccountId, Balance, BlockNumber, Call, Exposure, Hash, RewardDestination, SessionIndex, StakingLedger, ValidatorPrefs } from '@polkadot/types/interfaces';
import type { IExtrinsic } from '@polkadot/types/types';
import type { KeyringJson$Meta } from '@polkadot/ui-keyring/types';

export type CallParam = any;

export type CallParams = [] | CallParam[];

export interface CallOptions <T> {
  defaultValue?: T;
  paramMap?: (params: any) => CallParams;
  transform?: (value: any, api: ApiPromise) => T;
  withParams?: boolean;
  withParamsTransform?: boolean;
}

export type TxDef = [string, unknown[] | ((...params: unknown[]) => SubmittableExtrinsic<'promise'>)];

export type TxDefs = SubmittableExtrinsic<'promise'> | IExtrinsic | Call | TxDef | null;

export type TxSource<T extends TxDefs> = [T, boolean];

export type CollectiveType = 'alliance' | 'council' | 'membership' | 'technicalCommittee';

export interface ModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export interface Inflation {
  idealStake: number;
  idealInterest: number;
  inflation: number;
  stakedFraction: number;
  stakedReturn: number;
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
  extrinsic: SubmittableExtrinsic<'promise'> | null;
  isSubmittable: boolean;
  sendTx: () => void;
  sendUnsigned: () => void;
}

export interface TxProps {
  accountId?: string | null;
  onChangeAccountId?: (_: string | null) => void;
  onSuccess?: () => void;
  onFailed?: () => void;
  onStart?: () => void;
  onUpdate?: () => void;
}

export interface TxState extends ExtrinsicAndSenders {
  isSending: boolean;
  accountId?: string | null;
  onChangeAccountId: (_: string | null) => void;
}

export interface UseSudo {
  allAccounts: string[];
  hasSudoKey: boolean;
  sudoKey?: string;
}

export interface AddressFlags extends DeriveAccountFlags {
  isDevelopment: boolean;
  isEditable: boolean;
  isEthereum: boolean;
  isExternal: boolean;
  isFavorite: boolean;
  isHardware: boolean;
  isInContacts: boolean;
  isInjected: boolean;
  isMultisig: boolean;
  isProxied: boolean;
  isOwned: boolean;
  isValidator: boolean;
  isNominator: boolean;
}

export interface AddressIdentity extends DeriveAccountRegistration {
  isExistent: boolean;
  isKnownGood: boolean;
  waitCount: number;
}

export interface UseAccountInfo {
  accountIndex?: string;
  flags: AddressFlags;
  name: string;
  setName: React.Dispatch<string>;
  tags: string[];
  setTags: React.Dispatch<string[]>;
  genesisHash: string | null;
  identity?: AddressIdentity;
  isEditingName: boolean;
  meta?: KeyringJson$Meta;
  toggleIsEditingName: () => void;
  isEditingTags: boolean;
  isEditing: () => boolean;
  isNull: boolean;
  toggleIsEditingTags: () => void;
  onSaveName: () => void;
  onSaveTags: () => void;
  onSetGenesisHash: (genesisHash: string | null) => void;
  onForgetAddress: () => void;
  setIsEditingName: (isEditing: boolean) => void;
  setIsEditingTags: (isEditing: boolean) => void;
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

export interface Registrar {
  address: string;
  index: number;
}

export interface Judgement {
  judgementName: DisplayedJudgement;
  registrars: (Registrar | undefined)[];
}

export type UseJudgements = Judgement[]

export type BatchType = 'all' | 'default';

export interface BatchOptions {
  max?: number;
  type?: BatchType;
}
