// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HeaderExtended } from '@polkadot/api-derive/types';
import type { ProviderStats } from '@polkadot/rpc-provider/types';
import type { BlockNumber, EventRecord } from '@polkadot/types/interfaces';

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
