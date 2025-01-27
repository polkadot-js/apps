// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Blockchain } from '@acala-network/chopsticks-core';
import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsicFunction } from '@polkadot/api/promise/types';
import type { HeaderExtended } from '@polkadot/api-derive/types';
import type { LinkOption } from '@polkadot/apps-config/endpoints/types';
import type { InjectedExtension } from '@polkadot/extension-inject/types';
import type { ProviderStats } from '@polkadot/rpc-provider/types';
import type { BlockNumber, EventRecord } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';
import type { AssetInfoComplete } from '../types.js';

export interface ApiState {
  apiDefaultTx: SubmittableExtrinsicFunction;
  apiDefaultTxSudo: SubmittableExtrinsicFunction;
  chainSS58: number;
  fork: Blockchain | null;
  hasInjectedAccounts: boolean;
  isApiReady: boolean;
  isDevelopment: boolean;
  isEthereum: boolean;
  specName: string;
  specVersion: string;
  systemChain: string;
  systemName: string;
  systemVersion: string;
}

export interface ApiProps extends ApiState {
  api: ApiPromise;
  apiEndpoint: LinkOption | null;
  apiError: string | null;
  apiIdentity: ApiPromise;
  apiCoretime: ApiPromise;
  enableIdentity: boolean;
  apiRelay: ApiPromise | null;
  apiSystemPeople: ApiPromise | null;
  apiUrl?: string;
  createLink: (path: string, apiUrl?: string) => string;
  extensions?: InjectedExtension[];
  isApiConnected: boolean;
  isApiInitialized: boolean;
  isElectron: boolean;
  isWaitingInjected: boolean;
  isLocalFork?: boolean;
}

export interface Accounts {
  allAccounts: string[];
  allAccountsHex: string[];
  areAccountsLoaded: boolean;
  hasAccounts: boolean;
  isAccount: (address?: string | null | { toString: () => string }) => boolean;
}

export interface Addresses {
  allAddresses: string[];
  allAddressesHex: string[];
  areAddressesLoaded: boolean;
  hasAddresses: boolean;
  isAddress: (address?: string | null | { toString: () => string }) => boolean;
}

export interface ApiStats {
  stats: ProviderStats;
  when: number;
}

export interface PayWithAsset {
  isDisabled: boolean;
  assetOptions: {text: string, value: string}[];
  onChange: (assetId: BN, cb?: () => void) => void;
  selectedFeeAsset: AssetInfoComplete | null;
}

export interface BlockAuthors {
  byAuthor: Record<string, string>;
  eraPoints: Record<string, string>;
  lastBlockAuthors: string[];
  lastBlockNumber?: string;
  lastHeader?: HeaderExtended;
  lastHeaders: HeaderExtended[];
}

export interface BlockEvents {
  eventCount: number;
  events: KeyedEvent[];
}

export interface IndexedEvent {
  indexes: number[];
  record: EventRecord;
}

export interface KeyedEvent extends IndexedEvent {
  blockHash?: string;
  blockNumber?: BlockNumber;
  key: string;
}

export type SidebarState = [string | null, (() => void) | null];

export type Sidebar = undefined | (([address, onUpdateName]: SidebarState) => void);

export interface WindowSize {
  height: number;
  width: number;
}
