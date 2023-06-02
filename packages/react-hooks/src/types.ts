// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type React from 'react';
import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { DeriveAccountFlags, DeriveAccountRegistration } from '@polkadot/api-derive/types';
import type { DisplayedJudgement } from '@polkadot/react-components/types';
import type { AccountId, Balance, BlockNumber, Call, Exposure, Hash, RewardDestination, SessionIndex, StakingLedger, ValidatorPrefs } from '@polkadot/types/interfaces';
import type { PalletPreimageRequestStatus } from '@polkadot/types/lookup';
import type { ICompact, IExtrinsic, INumber, Registry } from '@polkadot/types/types';
import type { KeyringJson$Meta } from '@polkadot/ui-keyring/types';
import type { BN } from '@polkadot/util';
import type { HexString } from '@polkadot/util/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CallParam = any;

export type CallParams = [] | CallParam[];

export interface CallOptions <T> {
  defaultValue?: T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paramMap?: (params: any) => CallParams;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform?: (value: any, api: ApiPromise) => T;
  withParams?: boolean;
  withParamsTransform?: boolean;
}

export type TxDef = [string, unknown[] | ((...params: unknown[]) => SubmittableExtrinsic<'promise'>)];

export type TxDefs = SubmittableExtrinsic<'promise'> | IExtrinsic | Call | TxDef | null;

export type TxSource<T extends TxDefs> = [T, boolean];

export type CollectiveType = 'alliance' | 'council' | 'membership' | 'technicalCommittee';

export type Diverge<TType, TIntersect> = TType extends infer TDiverge & TIntersect ? TDiverge : TType

export type Leading<T extends any[]> = T extends [...infer Leading, any] ? Leading : []

export type NullablePartial<T> = { [P in keyof T]?: T[P] | null; }

export type PickKnownKeys<T> = {
  [P in keyof T as string extends P ? never : number extends P ? never : P]: T[P]
}

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

export const AddressIdentityOtherDiscordKey = 'Discord';

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

export interface PreimageDeposit {
  amount: BN;
  who: string;
}

export interface PreimageStatus {
  count: number;
  deposit?: PreimageDeposit;
  isCompleted: boolean;
  isHashParam: boolean;
  proposalHash: HexString;
  proposalLength?: BN;
  registry: Registry;
  status: PalletPreimageRequestStatus | null;
}

export interface PreimageBytes {
  proposal?: Call | null;
  proposalError?: string | null;
  proposalWarning?: string | null;
}

export interface Preimage extends PreimageBytes, PreimageStatus {
  // just the interfaces above
}

export interface V2WeightConstruct {
  refTime: BN | ICompact<INumber>;
  proofSize?: BN | ICompact<INumber>;
}

export interface WeightResult {
  v1Weight: BN;
  v2Weight: V2WeightConstruct;
}
