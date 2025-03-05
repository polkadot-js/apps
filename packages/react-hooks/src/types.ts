// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import '@polkadot/api-augment';

import type React from 'react';
import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { DeriveAccountFlags, DeriveAccountRegistration } from '@polkadot/api-derive/types';
import type { Option, u32, u128, Vec } from '@polkadot/types';
import type { AccountId, BlockNumber, Call, Hash, SessionIndex, ValidatorPrefs } from '@polkadot/types/interfaces';
import type { PalletAssetsAssetDetails, PalletAssetsAssetMetadata, PalletPreimageRequestStatus, PalletStakingRewardDestination, PalletStakingStakingLedger, PolkadotRuntimeParachainsAssignerCoretimeCoreDescriptor, SpStakingExposurePage, SpStakingPagedExposureMetadata } from '@polkadot/types/lookup';
import type { ICompact, IExtrinsic, INumber } from '@polkadot/types/types';
import type { KeyringJson$Meta } from '@polkadot/ui-keyring/types';
import type { BN } from '@polkadot/util';
import type { HexString } from '@polkadot/util/types';
import type { CoreTimeTypes } from './constants.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CallParam = any;

export type CallParams = [] | CallParam[];

export interface CallOptions<T> {
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

export interface AssetInfo {
  details: PalletAssetsAssetDetails | null;
  id: BN;
  isAdminMe: boolean;
  isIssuerMe: boolean;
  isFreezerMe: boolean;
  isOwnerMe: boolean;
  key: string;
  metadata: PalletAssetsAssetMetadata | null;
}

export interface AssetInfoComplete extends AssetInfo {
  details: PalletAssetsAssetDetails;
  metadata: PalletAssetsAssetMetadata;
}

export interface Slash {
  accountId: AccountId;
  amount: u128;
}

export interface SessionRewards {
  blockHash: Hash;
  blockNumber: BlockNumber;
  isEventsEmpty: boolean;
  reward: u128;
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
  onSetGenesisHash: (genesisHash: HexString | null) => void;
  onForgetAddress: () => void;
  setIsEditingName: (isEditing: boolean) => void;
  setIsEditingTags: (isEditing: boolean) => void;
}

export interface StakerState {
  controllerId: string | null;
  destination?: PalletStakingRewardDestination | null;
  exposurePaged?: Option<SpStakingExposurePage>;
  exposureMeta?: Option<SpStakingPagedExposureMetadata>
  claimedRewardsEras?: Vec<u32>
  hexSessionIdNext: string | null;
  hexSessionIdQueue: string | null;
  isLoading: boolean;
  isOwnController: boolean;
  isOwnStash: boolean;
  isStashNominating: boolean;
  isStashValidating: boolean;
  nominating?: string[];
  sessionIds: string[];
  stakingLedger?: PalletStakingStakingLedger;
  stashId: string;
  validatorPrefs?: ValidatorPrefs;
}

export interface Registrar {
  address: string;
  index: number;
}

export type BatchType = 'all' | 'default' | 'force';

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

export interface CoreDescription {
  core: number;
  info: PolkadotRuntimeParachainsAssignerCoretimeCoreDescriptor[];
}

export interface CoreDescriptorAssignment {
  task: string,
  ratio: number,
  remaining: number,
  isTask: boolean,
  isPool: boolean
}

export interface CoreDescriptor {
  core: number,
  info: {
    currentWork: {
      assignments: CoreDescriptorAssignment[],
      endHint: BN | null,
      pos: number,
      step: number
    },
    queue: {
      first: BN,
      last: BN
    }
  }
}

export interface OnDemandQueueStatus {
  traffic: u128;
  nextIndex: u32;
  smallestIndex: u32;
  freedIndices: [string, u32][];
}

export interface CoreWorkload {
  core: number,
  info: CoreWorkloadInfo
}

export interface CoreWorkloadInfo {
  task: number | string,
  isTask: boolean
  isPool: boolean
  mask: string[]
  maskBits: number
}
export interface CoreWorkplan {
  core: number;
  info: CoreWorkplanInfo
  timeslice: number;
}

export interface CoreWorkplanInfo {
  task: number | string,
  isTask: boolean
  isPool: boolean
  mask: string[]
  maskBits: number
}

export interface RegionInfo {
  core: number,
  start: number,
  end: number,
  owner: string,
  paid: string,
  mask: `0x${string}`
}

export interface Reservation {
  task: string
  mask: string[],
  maskBits: number
}

export interface LegacyLease {
  core: number,
  until: number,
  task: string
}

export interface PalletBrokerSaleInfoRecord {
  saleStart: number;
  leadinLength: number;
  endPrice: BN;
  regionBegin: number;
  regionEnd: number;
  idealCoresSold: number;
  coresOffered: number;
  firstCore: number;
  selloutPrice: BN;
  coresSold: number;
}

export interface PalletBrokerConfigRecord {
  advanceNotice: number;
  interludeLength: number;
  leadinLength: number;
  regionLength: number;
  idealBulkProportion: BN;
  limitCoresOffered: number;
  renewalBump: BN;
  contributionTimeout: number;
}

export interface ChainWorkTaskInformation {
  lastBlock: number
  renewal: PotentialRenewal | undefined
  renewalStatus: string
  renewalStatusMessage: string
  type: CoreTimeTypes
  workload: CoreWorkload | undefined
  workplan: CoreWorkplan[] | undefined
}

export interface ChainInformation {
  id: number,
  lease: LegacyLease | undefined,
  reservation: Reservation| undefined
  workTaskInfo: ChainWorkTaskInformation[]
}
export interface ChainBlockConstants {
  blocksPerTimeslice: number,
  blocktimeMs: number
}

export interface ChainConstants {
  coretime: ChainBlockConstants,
  relay: ChainBlockConstants
}

export interface CoretimeInformation {
  constants: ChainConstants,
  chainInfo: Record<number, ChainInformation>,
  salesInfo: PalletBrokerSaleInfoRecord,
  status: BrokerStatus,
  region: RegionInfo[],
  config: PalletBrokerConfigRecord
  taskIds: number[]
}

export interface BrokerStatus {
  coreCount: number;
  privatePoolSize: number;
  systemPoolSize: number;
  lastCommittedTimeslice: number;
  lastTimeslice: number;
}

export interface PotentialRenewal {
  core: number,
  when: number,
  price: BN,
  completion: 'Complete' | 'Partial',
  mask: string[]
  maskBits: number,
  task: string
}
