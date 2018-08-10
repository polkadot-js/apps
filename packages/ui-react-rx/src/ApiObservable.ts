// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Header } from '@polkadot/primitives/header';
import { RxApiInterface } from '@polkadot/api-rx/types';
import { ExtendedBalance, ExtendedBalanceMap, ObservableApiInterface } from './types';

import BN from 'bn.js';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap, toArray } from 'rxjs/operators';
import storage from '@polkadot/storage';
import encodeAddress from '@polkadot/util-keyring/address/encode';

type OptBN = BN | undefined;
type OptDate = Date | undefined;

export default class ObservableApi implements ObservableApiInterface {
  private api: RxApiInterface;

  constructor (api: RxApiInterface) {
    this.api = api;
  }

  private combine <T, R> (observables: Array<Observable<any>>, mapfn: (combined: R) => T): Observable<T> {
    return combineLatest(...observables).pipe(map(mapfn));
  }

  bestNumber = (): Observable<OptBN> => {
    return this.api.chain.newHead().pipe(
      map((header?: Header): OptBN =>
        header && header.number
          ? header.number
          : undefined
      )
    );
  }

  eraBlockLength = (): Observable<OptBN> => {
    return this.combine(
      [
        this.api.state.getStorage(storage.session.public.length),
        this.api.state.getStorage(storage.staking.public.sessionsPerEra)
      ],
      ([sessionLength, sessionsPerEra]: [OptBN, OptBN]): OptBN =>
        sessionLength && sessionsPerEra
          ? sessionLength.mul(sessionsPerEra)
          : undefined
    );
  }

  eraBlockProgress = (): Observable<OptBN> => {
    return this.combine(
      [
        this.sessionBlockProgress(),
        this.api.state.getStorage(storage.session.public.length),
        this.api.state.getStorage(storage.session.public.currentIndex),
        this.api.state.getStorage(storage.staking.public.sessionsPerEra),
        this.api.state.getStorage(storage.staking.public.lastEraLengthChange)
      ],
      ([sessionBlockProgress, sessionLength, sessionCurrentIndex, sessionsPerEra, lastEraLengthChange]: [OptBN, OptBN, OptBN, OptBN, OptBN]): OptBN =>
        sessionsPerEra && sessionCurrentIndex && sessionLength && sessionBlockProgress && lastEraLengthChange
          ? sessionCurrentIndex
              .sub(lastEraLengthChange)
              .mod(sessionsPerEra)
              .mul(sessionLength)
              .add(sessionBlockProgress)
          : undefined
    );
  }

  eraBlockRemaining = (): Observable<OptBN> => {
    return this.combine(
      [
        this.eraBlockLength(),
        this.eraBlockProgress()
      ],
      ([eraBlockLength, eraBlockProgress]: [OptBN, OptBN]): OptBN =>
        eraBlockLength && eraBlockProgress
          ? eraBlockLength.sub(eraBlockProgress)
          : undefined
    );
  }

  sessionBlockProgress = (): Observable<OptBN> => {
    return this.combine(
      [
        this.bestNumber(),
        this.api.state.getStorage(storage.session.public.length),
        this.api.state.getStorage(storage.session.public.lastLengthChange)
      ],
      ([bestNumber, sessionLength, lastSessionLengthChange]: [OptBN, OptBN, OptBN]): OptBN =>
        bestNumber && sessionLength && lastSessionLengthChange
          ? bestNumber
              .sub(lastSessionLengthChange)
              .add(sessionLength)
              .mod(sessionLength)
          : undefined
    );
  }

  sessionBlockRemaining = (): Observable<OptBN> => {
    return this.combine(
      [
        this.sessionBlockProgress(),
        this.api.state.getStorage(storage.session.public.length)
      ],
      ([sessionBlockProgress, sessionLength]: [OptBN, OptBN]): OptBN =>
        sessionBlockProgress && sessionLength
          ? sessionLength.sub(sessionBlockProgress)
          : undefined
    );
  }

  sessionBrokenValue = (): Observable<OptBN> => {
    return this.combine(
      [
        this.sessionBlockRemaining(),
        this.sessionTimeExpected(),
        this.sessionTimeRemaining(),
        this.api.state.getStorage(storage.session.public.currentStart),
        this.api.state.getStorage(storage.timestamp.public.blockPeriod),
        this.api.state.getStorage(storage.timestamp.public.now)
      ],
      ([sessionBlockRemaining, sessionTimeExpected, sessionTimeRemaining, sessionCurrentStart, blockPeriod, now]: [OptBN, OptBN, OptBN, OptDate, OptDate, OptDate]): OptBN =>
        sessionBlockRemaining && sessionTimeExpected && sessionTimeRemaining && sessionCurrentStart && blockPeriod && now
          ? new BN(
            Math.round(
              100 * (now.getTime() + sessionTimeRemaining.toNumber() - sessionCurrentStart.getTime()) / sessionTimeExpected.toNumber() - 100
            )
          )
          : undefined
    );
  }

  sessionTimeExpected = (): Observable<OptBN> => {
    return this.combine(
      [
        this.api.state.getStorage(storage.session.public.length),
        this.api.state.getStorage(storage.timestamp.public.blockPeriod)
      ],
      ([sessionLength, blockPeriod]: [OptBN, OptBN]): OptBN =>
        sessionLength && blockPeriod
          ? blockPeriod.mul(sessionLength).muln(1000)
          : undefined
    );
  }

  sessionTimeRemaining = (): Observable<OptBN> => {
    return this.combine(
      [
        this.sessionBlockRemaining(),
        this.api.state.getStorage(storage.timestamp.public.blockPeriod)
      ],
      ([sessionBlockRemaining, blockPeriod]: [OptBN, OptBN]): OptBN =>
        blockPeriod && sessionBlockRemaining
          ? blockPeriod.mul(sessionBlockRemaining).muln(1000)
          : undefined
    );
  }

  validatingBalance = (address: string): Observable<ExtendedBalance> => {
    return this.combine(
      [
        this.votingBalance(address),
        this.api.state
          .getStorage(storage.staking.public.nominatorsFor, address)
          .pipe(
            switchMap((nominators = []) =>
              // FIXME: Will not be needed after https://github.com/polkadot-js/apps/issues/128
              this.votingBalances(nominators.map(encodeAddress))
            ),
            toArray()
          )
      ],
      ([balance, [nominators = []]]: [ExtendedBalance, [Array<ExtendedBalance>]]): ExtendedBalance => {
        const nominatedBalance = nominators.reduce((total, nominator: ExtendedBalance) => {
          return total.add(nominator.votingBalance);
        }, new BN(0));

        return {
          ...balance,
          nominators,
          nominatedBalance,
          stakingBalance: nominatedBalance.add(balance.votingBalance)
        };
      }
    );
  }

  validatingBalances = (addresses: Array<string>): Observable<ExtendedBalanceMap> => {
    return this.combine(
      addresses.map((address) =>
        this.validatingBalance(address)
      ),
      (result: Array<ExtendedBalance>): ExtendedBalanceMap =>
        result.reduce((balances, balance) => {
          balances[balance.address] = balance;

          return balances;
        }, {} as ExtendedBalanceMap)
    );
  }

  votingBalance = (address: string): Observable<ExtendedBalance> => {
    return this.combine(
      [
        this.api.state.getStorage(storage.staking.public.freeBalanceOf, address),
        this.api.state.getStorage(storage.staking.public.reservedBalanceOf, address)
      ],
      ([freeBalance = new BN(0), reservedBalance = new BN(0)]: [OptBN, OptBN]): ExtendedBalance => ({
        address,
        freeBalance,
        nominatedBalance: new BN(0),
        reservedBalance,
        stakingBalance: new BN(0),
        votingBalance: freeBalance.add(reservedBalance)
      })
    );
  }

  votingBalances = (addresses: Array<string>): Observable<ExtendedBalance[]> => {
    return combineLatest(
      addresses.map((address) =>
        this.votingBalance(address)
      )
    );
  }
}
