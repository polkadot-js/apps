// Copyright 2017-2018 @polkadot/ui-observable authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { RxBalance, RxBalanceMap, RxReferendumVote } from './types';

import BN from 'bn.js';
import { EMPTY, Observable } from 'rxjs';
import { switchMap, defaultIfEmpty, map } from 'rxjs/operators';
import { AccountId, Balance, Bool, BlockNumber, Moment, ReferendumIndex } from '@polkadot/api-codec/index';
import isString from '@polkadot/util/is/string';

import ApiCalls from './Calls';
import { RxProposal, RxReferendum } from './classes';

// Combines API calls and queries into single results. This allos for the exposed API to have
// useful extensions, i.e. queries can be made that returns the results from multiple observables,
// make the noise for the API users significantly less
export default class ApiCombined extends ApiCalls {
  democracyProposalCount = (): Observable<number> => {
    return this
      .democracyPublicProposals()
      .pipe(
        map((proposals: Array<RxProposal>) =>
          proposals.length
        )
      );
  }

  democracyReferendumInfos = (referendumIds: Array<ReferendumIndex | BN | number>): Observable<Array<RxReferendum>> => {
    return this.combine(
      referendumIds.map((referendumId) =>
        this.democracyReferendumInfoOf(referendumId)
      ),
      (referendums: Array<RxReferendum> = []): Array<RxReferendum> =>
        referendums.filter((referendum) =>
          referendum
        )
    );
  }

  democracyReferendumVoters = (referendumId: ReferendumIndex | BN | number): Observable<Array<RxReferendumVote>> => {
    return this.combine(
      [
        this.democacyVotersFor(referendumId),
        this.democracyVotersBalancesOf(referendumId),
        this.democracyVotersVotesOf(referendumId)
      ],
      ([voters, balances, votes]: [Array<AccountId>, Array<Balance>, Array<Bool>]): Array<RxReferendumVote> =>
        voters.map((address, index): RxReferendumVote => ({
          address,
          balance: balances[index] || new Balance(0),
          vote: votes[index] || new Bool(false)
        }))
    );
  }

  democracyReferendums = (): Observable<Array<RxReferendum>> => {
    return this.combine(
      [
        this.democracyReferendumCount(),
        this.democracyNextTally()
      ]
    ).pipe(
      // @ts-ignore After upgrade to 6.3.2
      switchMap(([referendumCount, nextTally]: [ReferendumIndex | undefined, ReferendumIndex | undefined]): Observable<Array<RxReferendum>> =>
        referendumCount && nextTally && referendumCount.gt(nextTally) && referendumCount.gt(0)
          ? this.democracyReferendumInfos(
            [...Array(referendumCount.toBn().sub(nextTally.toBn()).toNumber())].map((_, i) =>
              nextTally.add(i).toNumber()
            )
          )
          : EMPTY
      ),
      defaultIfEmpty([])
    );
  }

  democracyVotesOf = (index: ReferendumIndex | BN | number, addresses: Array<AccountId | string>): Observable<boolean> => {
    return this.combine(
      addresses.map((address) =>
        this.democacyVoteOf(index, address)
      )
    );
  }

  democracyVotersBalancesOf = (referendumId: ReferendumIndex | BN | number): Observable<Array<Balance>> => {
    return this
      .democacyVotersFor(referendumId)
      .pipe(
        switchMap((voters: Array<AccountId> = []) =>
          this.votingBalances(...voters)
        ),
        defaultIfEmpty([] as any),
        map((balances: Array<RxBalance>) =>
          balances.map(({ votingBalance }) =>
            votingBalance
          )
        )
      );
  }

  democracyVotersVotesOf = (referendumId: ReferendumIndex | BN | number): Observable<Array<Bool>> => {
    return this
      .democacyVotersFor(referendumId)
      .pipe(
        switchMap((voters: Array<AccountId> = []) =>
          this.democracyVotesOf(referendumId, voters)
        ),
        defaultIfEmpty([] as any)
      );
  }

  eraBlockLength = (): Observable<BlockNumber | undefined> => {
    return this.combine(
      [
        this.sessionLength(),
        this.sessionsPerEra()
      ],
      ([sessionLength, sessionsPerEra]: [BlockNumber | undefined, BlockNumber | undefined]): BlockNumber | undefined =>
        sessionLength && sessionsPerEra
          ? new BlockNumber(
            sessionLength.mul(sessionsPerEra)
          )
          : undefined
    );
  }

  eraBlockProgress = (): Observable<BlockNumber | undefined> => {
    return this.combine(
      [
        this.sessionBlockProgress(),
        this.sessionLength(),
        this.sessionCurrentIndex(),
        this.sessionsPerEra(),
        this.eraLastLengthChange()
      ],
      ([sessionBlockProgress, sessionLength, sessionCurrentIndex, sessionsPerEra, eraLastLengthChange = new BlockNumber(0)]: [BlockNumber | undefined, BlockNumber | undefined, BlockNumber | undefined, BlockNumber | undefined, BlockNumber | undefined]): BlockNumber | undefined =>
        sessionsPerEra && sessionCurrentIndex && sessionLength && sessionBlockProgress && eraLastLengthChange
          ? new BlockNumber(
            sessionCurrentIndex
              .sub(eraLastLengthChange)
              .mod(sessionsPerEra.toBn())
              .mul(sessionLength.toBn())
              .add(sessionBlockProgress.toBn())
          )
          : undefined
    );
  }

  eraBlockRemaining = (): Observable<BlockNumber | undefined> => {
    return this.combine(
      [
        this.eraBlockLength(),
        this.eraBlockProgress()
      ],
      ([eraBlockLength, eraBlockProgress]: [BlockNumber | undefined, BlockNumber | undefined]): BlockNumber | undefined =>
        eraBlockLength && eraBlockProgress
          ? new BlockNumber(
            eraBlockLength.sub(eraBlockProgress)
          )
          : undefined
    );
  }

  sessionBlockProgress = (): Observable<BlockNumber | undefined> => {
    return this.combine(
      [
        this.bestNumber(),
        this.sessionLength(),
        this.sessionLastLengthChange()
      ],
      ([bestNumber, sessionLength, lastSessionLengthChange]: [BlockNumber | undefined, BlockNumber | undefined, BlockNumber | undefined]): BlockNumber | undefined =>
        bestNumber && sessionLength && lastSessionLengthChange
          ? new BlockNumber(
            bestNumber
              .sub(lastSessionLengthChange)
              .add(sessionLength.toBn())
              .mod(sessionLength.toBn())
          )
          : undefined
    );
  }

  sessionBlockRemaining = (): Observable<BlockNumber | undefined> => {
    return this.combine(
      [
        this.sessionBlockProgress(),
        this.sessionLength()
      ],
      ([sessionBlockProgress, sessionLength]: [BlockNumber | undefined, BlockNumber | undefined]): BlockNumber | undefined =>
        sessionBlockProgress && sessionLength
          ? new BlockNumber(
            sessionLength.sub(sessionBlockProgress)
          )
          : undefined
    );
  }

  sessionBrokenValue = (): Observable<Moment | undefined> => {
    return this.combine(
      [
        this.timestampNow(),
        this.sessionTimeExpected(),
        this.sessionTimeRemaining(),
        this.sessionCurrentStart()
      ],
      ([now, sessionTimeExpected, sessionTimeRemaining, sessionCurrentStart]: [Moment | undefined, Moment | undefined, Moment | undefined, Moment | undefined]): Moment | undefined =>
        sessionTimeExpected && sessionTimeRemaining && sessionCurrentStart && now
          ? new Moment(
            Math.round(
              100 * (now.getTime() + sessionTimeRemaining.toNumber() - sessionCurrentStart.getTime()) / sessionTimeExpected.toNumber() - 100
            )
          )
          : undefined
    );
  }

  sessionTimeExpected = (): Observable<Moment | undefined> => {
    return this.combine(
      [
        this.sessionLength(),
        this.timestampBlockPeriod()
      ],
      ([sessionLength, blockPeriod]: [BlockNumber | undefined, Moment | undefined]): Moment | undefined =>
        sessionLength && blockPeriod
          ? new Moment(
            sessionLength.mul(blockPeriod.toBn()).muln(1000)
          )
          : undefined
    );
  }

  sessionTimeRemaining = (): Observable<Moment | undefined> => {
    return this.combine(
      [
        this.sessionBlockRemaining(),
        this.timestampBlockPeriod()
      ],
      ([sessionBlockRemaining, blockPeriod]: [BlockNumber | undefined, Moment | undefined]): Moment | undefined =>
        blockPeriod && sessionBlockRemaining
          ? new Moment(
            sessionBlockRemaining.mul(blockPeriod.toBn()).muln(1000)
          )
          : undefined
    );
  }

  validatingBalance = (address: AccountId | string): Observable<RxBalance> => {
    return this.combine(
      [
        this.votingBalance(address),
        this.votingBalancesNominatorsFor(address)
      ],
      ([balance, nominators = []]: [RxBalance, Array<RxBalance>]): RxBalance => {
        const nominatedBalance = nominators.reduce((total, nominator: RxBalance) => {
          return total.add(nominator.votingBalance.toBn());
        }, new BN(0));

        const result = {
          ...balance,
          nominators,
          nominatedBalance: new Balance(nominatedBalance),
          stakingBalance: new Balance(
            nominatedBalance.add(balance.votingBalance.toBn())
          )
        };

        return result;
      }
    );
  }

  validatingBalances = (...addresses: Array<AccountId | string>): Observable<RxBalanceMap> => {
    return this.combine(
      addresses.map((address) =>
        this.validatingBalance(address)
      ),
      (result: Array<RxBalance>): RxBalanceMap =>
        result.reduce((balances, balance) => {
          balances[balance.address.toString()] = balance;

          return balances;
        }, {} as RxBalanceMap)
    );
  }

  votingBalance = (_address: AccountId | string): Observable<RxBalance> => {
    const address = isString(_address)
      ? new AccountId(_address)
      : _address;

    return this.combine(
      [
        this.stakingFreeBalanceOf(address),
        this.stakingReservedBalanceOf(address)
      ],
      ([freeBalance = new Balance(0), reservedBalance = new Balance(0)]: [Balance | undefined, Balance | undefined]): RxBalance => ({
        address,
        freeBalance,
        nominatedBalance: new Balance(0),
        reservedBalance,
        stakingBalance: new Balance(0),
        votingBalance: new Balance(
          freeBalance.add(reservedBalance)
        )
      })
    );
  }

  votingBalancesNominatorsFor = (address: AccountId | string) => {
    return this
      .stakingNominatorsFor(address)
      .pipe(
        switchMap((nominators: Array<AccountId>) =>
          this.votingBalances(...nominators)
        ),
        defaultIfEmpty([] as any)
      );
  }

  votingBalances = (...addresses: Array<AccountId | string>): Observable<RxBalance[]> => {
    return this.combine(
      addresses.map((address) =>
        this.votingBalance(address)
      )
    );
  }
}
