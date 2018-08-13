// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import BN from 'bn.js';
import { Observable } from 'rxjs';
import { Interfaces } from '@polkadot/jsonrpc/types';
import { SectionItem } from '@polkadot/params/types';
import { Header } from '@polkadot/primitives/header';
import { Storages } from '@polkadot/storage/types';

export type ExtendedBalance = {
  address: string,
  freeBalance: BN,
  nominatedBalance: BN,
  reservedBalance: BN,
  votingBalance: BN,
  stakingBalance: BN,
  nominators?: Array<ExtendedBalance>
}

export type ExtendedBalanceMap = {
  [index: string]: ExtendedBalance
}

export type KeyWithParams = [SectionItem<Storages>, any];

export interface ObservableApiInterface {
  rawCall: <T> ({ name, section }: SectionItem<Interfaces>, ...params: Array<any>) => Observable<T>,
  rawStorage: <T> (key: SectionItem<Storages>, ...params: Array<any>) => Observable<T>,
  rawStorageMulti: <T> (...keys: Array<[SectionItem<Storages>, any]>) => Observable<T>,
  bestNumber: () => Observable<BN | undefined>,
  chainNewHead: () => Observable<Header | undefined>,
  democracyLaunchPeriod: () => Observable<BN | undefined>,
  democracyNextTally: () => Observable<BN | undefined>,
  democracyReferendumCount: () => Observable<BN | undefined>,
  democracyVotingPeriod: () => Observable<BN | undefined>,
  eraBlockLength: () => Observable<BN | undefined>,
  eraBlockProgress: () => Observable<BN | undefined>,
  eraBlockRemaining: () => Observable<BN | undefined>,
  sessionBlockProgress: () => Observable<BN | undefined>,
  sessionBlockRemaining: () => Observable<BN | undefined>,
  sessionBrokenPercentLate: () => Observable<BN | undefined>,
  sessionBrokenValue: () => Observable<BN | undefined>,
  sessionLength: () => Observable<BN | undefined>,
  sessionTimeExpected: () => Observable<BN | undefined>,
  sessionTimeRemaining: () => Observable<BN | undefined>,
  sessionValidators: () => Observable<Array<string>>,
  stakingFreeBalanceOf: (address: string) => Observable<BN | undefined>,
  stakingIntentions: () => Observable<Array<string>>,
  stakingNominatorsFor: (address: string) => Observable<Array<string>>,
  stakingNominating: (address: string) => Observable<string | undefined>,
  stakingReservedBalanceOf: (address: string) => Observable<BN | undefined>,
  systemAccountIndexOf: (address: string) => Observable<BN | undefined>,
  timestampBlockPeriod: () => Observable<BN | undefined>,
  timestampNow: () => Observable<Date | undefined>,
  validatingBalance: (address: string) => Observable<ExtendedBalance>,
  validatingBalances: (...addresses: Array<string>) => Observable<ExtendedBalanceMap>,
  votingBalance: (address: string) => Observable<ExtendedBalance>,
  votingBalances: (...addresses: Array<string>) => Observable<ExtendedBalance[]>
}

export type ObservableApiNames = keyof ObservableApiInterface;

export type ReferendumVotes = {
  [index: string]: {
    address: string,
    balance: BN,
    vote: boolean
  }
};
