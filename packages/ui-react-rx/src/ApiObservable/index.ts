// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Header } from '@polkadot/primitives/header';
import { RxApiInterface, RxApiInterface$Method } from '@polkadot/api-rx/types';
import { Interfaces } from '@polkadot/jsonrpc/types';
import { BlockDecoded, ExtrinsicDecoded, SectionItem } from '@polkadot/params/types';
import { Storages } from '@polkadot/storage/types';
import { RxBalance, RxBalanceMap, RxFees, RxProposal, RxProposalDeposits, RxReferendum, ObservableApiInterface, KeyWithParams, KeyWithoutParams, RxReferendumVote } from './types';

import BN from 'bn.js';
import { EMPTY, Observable, combineLatest } from 'rxjs';
import { switchMap, defaultIfEmpty, map } from 'rxjs/operators';
import storage from '@polkadot/storage';
import assert from '@polkadot/util/assert';
import isUndefined from '@polkadot/util/is/undefined';

type OptBN = BN | undefined;
type OptDate = Date | undefined;
type MapFn<R, T> = (combined: R) => T;

type ResultReferendum = [BN, ExtrinsicDecoded, number];
type ResultProposal = [BN, ExtrinsicDecoded, string];
type ResultProposalDeposits = [BN, Array<string>];

const defaultMapFn = (result: any): any =>
  result;

export default class ObservableApi implements ObservableApiInterface {
  private api: RxApiInterface;

  constructor (api: RxApiInterface) {
    this.api = api;
  }

  private combine = <T, R> (observables: Array<Observable<any>>, mapfn: MapFn<R, T> = defaultMapFn): Observable<T> => {
    return combineLatest(...observables).pipe(
      // FIXME There are a couple of places now where this casting happens after rxjs 6.3.2
      defaultIfEmpty([] as any),
      map(mapfn)
    );
  }

  rawCall = <T> ({ name, section }: SectionItem<Interfaces>, ...params: Array<any>): Observable<T> => {
    assert(section && this.api[section], `Unable to find 'api.${section}'`);

    const fn: RxApiInterface$Method = section
      ? this.api[section][name]
      // @ts-ignore This one is done for 'isConnected'
      : this.api[name];

    assert(fn, `Unable to find 'api${section ? '.' : ''}${section || ''}.${name}'`);

    return fn.apply(null, params);
  }

  rawStorage = <T> (key: SectionItem<Storages>, ...params: Array<any>): Observable<T> => {
    return this
      .rawStorageMulti([key, ...params] as KeyWithParams)
      .pipe(
        // @ts-ignore After upgrade to 6.3.2
        map(([result]: Array<T>): T =>
          result
        )
      );
  }

  rawStorageMulti = <T> (...keys: Array<KeyWithParams | KeyWithoutParams>): Observable<T> => {
    return this.api.state
      .storage(keys)
      .pipe(
        map((result?: any) =>
          isUndefined(result)
            ? []
            : result
        )
      );
  }

  bestNumber = (): Observable<OptBN> => {
    return this
      .chainNewHead()
      .pipe(
        map((header?: Header): OptBN =>
          header && header.number
            ? header.number
            : undefined
        )
      );
  }

  chainGetBlock = (hash: Uint8Array): Observable<BlockDecoded | undefined> => {
    return this.api.chain.getBlock(hash);
  }

  chainNewHead = (): Observable<Header | undefined> => {
    return this.api.chain.newHead().pipe(
      defaultIfEmpty()
    );
  }

  democracyLaunchPeriod = (): Observable<OptBN> => {
    return this.rawStorage(storage.democracy.public.launchPeriod);
  }

  democracyNextTally = (): Observable<OptBN> => {
    return this.rawStorage(storage.democracy.public.nextTally);
  }

  democracyProposals = (): Observable<Array<RxProposal>> => {
    return this
      .rawStorage(storage.democracy.public.proposals)
      .pipe(
        // @ts-ignore After upgrade to 6.3.2
        map((proposals: Array<ResultProposal> = []) =>
          proposals
            .map((result: ResultProposal): RxProposal | undefined =>
              result && result[1]
                ? {
                  address: result[2],
                  id: result[0],
                  proposal: result[1]
                }
                : undefined
            )
            .filter((proposal) =>
              proposal
            )
        )
    );
  }

  democracyProposalCount = (): Observable<number> => {
    return this
      .democracyProposals()
      .pipe(
        map((proposals: Array<RxProposal>) =>
          proposals.length
        )
      );
  }

  democracyProposalDeposits = (proposalId: BN): Observable<RxProposalDeposits | undefined> => {
    return this
      .rawStorage(storage.democracy.public.depositOf, proposalId)
      .pipe(
        // @ts-ignore After upgrade to 6.3.2
        map((result: ResultProposalDeposits): RxProposalDeposits | undefined =>
          result && result[0]
            ? {
              addresses: result[1] || [],
              balance: result[0]
            }
            : undefined
        )
      );
  }

  democracyReferendumCount = (): Observable<OptBN> => {
    return this.rawStorage(storage.democracy.public.referendumCount);
  }

  democracyReferendumInfoOf = (referendumId: BN | number): Observable<RxReferendum> => {
    return this
      .rawStorage(storage.democracy.public.referendumInfoOf, referendumId)
      .pipe(
        // @ts-ignore After upgrade to 6.3.2
        map((result: ResultReferendum) =>
          result && result[1]
            ? {
              blockNumber: result[0],
              id: new BN(referendumId),
              proposal: result[1],
              voteThreshold: result[2]
            }
            : undefined
        )
      );
  }

  democracyReferendumInfos = (referendumIds: Array<number>): Observable<Array<RxReferendum>> => {
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

  democracyReferendumVoters = (referendumId: BN): Observable<Array<RxReferendumVote>> => {
    return this.combine(
      [
        this.democacyVotersFor(referendumId),
        this.democracyVotersBalancesOf(referendumId),
        this.democracyVotersVotesOf(referendumId)
      ],
      ([voters, balances, votes]: [Array<string>, Array<BN>, Array<boolean>]): Array<RxReferendumVote> =>
        voters.map((address, index): RxReferendumVote => ({
          address,
          balance: balances[index] || new BN(0),
          vote: votes[index] || false
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
      switchMap(([referendumCount, nextTally]: [OptBN, OptBN]): Observable<Array<RxReferendum>> =>
        referendumCount && nextTally && referendumCount.gt(nextTally) && referendumCount.gtn(0)
          ? this.democracyReferendumInfos(
            [...Array(referendumCount.sub(nextTally).toNumber())].map((_, i) =>
              nextTally.addn(i).toNumber()
            )
          )
          : EMPTY
      ),
      defaultIfEmpty([])
    );
  }

  democacyVoteOf = (index: BN, address: string): Observable<boolean> => {
    return this.rawStorage(storage.democracy.public.voteOf, index, address);
  }

  democracyVotesOf = (index: BN, addresses: Array<string>): Observable<boolean> => {
    return this.combine(
      addresses.map((address) =>
        this.democacyVoteOf(index, address)
      )
    );
  }

  democacyVotersFor = (index: BN): Observable<Array<string>> => {
    return this
      .rawStorage(storage.democracy.public.votersFor, index)
      .pipe(
        // @ts-ignore After upgrade to 6.3.2
        map((voters: Array<string> = []) =>
          voters
        )
      );
  }

  democracyVotersBalancesOf = (referendumId: BN): Observable<Array<BN>> => {
    return this
      .democacyVotersFor(referendumId)
      .pipe(
        switchMap((voters: Array<string> = []) =>
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

  democracyVotersVotesOf = (referendumId: BN): Observable<Array<boolean>> => {
    return this
      .democacyVotersFor(referendumId)
      .pipe(
        switchMap((voters: Array<string> = []) =>
          this.democracyVotesOf(referendumId, voters)
        ),
        defaultIfEmpty([] as any)
      );
  }

  democracyVotingPeriod = (): Observable<OptBN> => {
    return this.rawStorage(storage.democracy.public.votingPeriod);
  }

  eraBlockLength = (): Observable<OptBN> => {
    return this.combine(
      [
        this.sessionLength(),
        this.sessionsPerEra()
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
        this.sessionLength(),
        this.sessionCurrentIndex(),
        this.sessionsPerEra(),
        this.eraLastLengthChange()
      ],
      ([sessionBlockProgress, sessionLength, sessionCurrentIndex, sessionsPerEra, eraLastLengthChange = new BN(0)]: [OptBN, OptBN, OptBN, OptBN, OptBN]): OptBN =>
        sessionsPerEra && sessionCurrentIndex && sessionLength && sessionBlockProgress && eraLastLengthChange
          ? sessionCurrentIndex
              .sub(eraLastLengthChange)
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

  fees = (): Observable<RxFees> => {
    return this
      .rawStorageMulti(
        [storage.staking.public.transactionBaseFee],
        [storage.staking.public.transactionByteFee],
        [storage.staking.public.creationFee],
        [storage.staking.public.existentialDeposit ],
        [storage.staking.public.transferFee ]
      )
      .pipe(
        // @ts-ignore After upgrade to 6.3.2
        map(([baseFee = new BN(0), byteFee = new BN(0), creationFee = new BN(0), existentialDeposit = new BN(0), transferFee = new BN(0)]: [OptBN, OptBN, OptBN, OptBN, OptBN]) => ({
          baseFee,
          byteFee,
          creationFee,
          existentialDeposit,
          transferFee
        }))
      );
  }

  eraLastLengthChange = (): Observable<OptBN> => {
    return this.rawStorage(storage.staking.public.lastEraLengthChange);
  }

  sessionBlockProgress = (): Observable<OptBN> => {
    return this.combine(
      [
        this.bestNumber(),
        this.sessionLength(),
        this.sessionLastLengthChange()
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
        this.sessionLength()
      ],
      ([sessionBlockProgress, sessionLength]: [OptBN, OptBN]): OptBN =>
        sessionBlockProgress && sessionLength
          ? sessionLength.sub(sessionBlockProgress)
          : undefined
    );
  }

  sessionBrokenPercentLate = (): Observable<OptBN> => {
    return this.rawStorage(storage.session.public.brokenPercentLate);
  }

  sessionBrokenValue = (): Observable<OptBN> => {
    return this.combine(
      [
        this.timestampNow(),
        this.sessionTimeExpected(),
        this.sessionTimeRemaining(),
        this.sessionCurrentStart()
      ],
      ([now, sessionTimeExpected, sessionTimeRemaining, sessionCurrentStart]: [OptDate, OptBN, OptBN, OptDate]): OptBN =>
        sessionTimeExpected && sessionTimeRemaining && sessionCurrentStart && now
          ? new BN(
            Math.round(
              100 * (now.getTime() + sessionTimeRemaining.toNumber() - sessionCurrentStart.getTime()) / sessionTimeExpected.toNumber() - 100
            )
          )
          : undefined
    );
  }

  sessionCurrentIndex = (): Observable<OptBN> => {
    return this.rawStorage(storage.session.public.currentIndex);
  }

  sessionCurrentStart = (): Observable<OptBN> => {
    return this.rawStorage(storage.session.public.currentStart);
  }

  sessionLastLengthChange = (): Observable<OptBN> => {
    return this.rawStorage(storage.session.public.lastLengthChange);
  }

  sessionLength = (): Observable<OptBN> => {
    return this.rawStorage(storage.session.public.length);
  }

  sessionsPerEra = (): Observable<OptBN> => {
    return this.rawStorage(storage.staking.public.sessionsPerEra);
  }

  sessionTimeExpected = (): Observable<OptBN> => {
    return this.combine(
      [
        this.sessionLength(),
        this.timestampBlockPeriod()
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
        this.timestampBlockPeriod()
      ],
      ([sessionBlockRemaining, blockPeriod]: [OptBN, OptBN]): OptBN =>
        blockPeriod && sessionBlockRemaining
          ? blockPeriod.mul(sessionBlockRemaining).muln(1000)
          : undefined
    );
  }

  sessionValidators = (): Observable<Array<string>> => {
    return this
      .rawStorage(storage.session.public.validators)
      .pipe(
        // @ts-ignore After upgrade to 6.3.2
        map((validators: Array<string> = []) =>
          validators
        )
      );
  }

  stakingIntentions = (): Observable<Array<string>> => {
    return this
      .rawStorage(storage.staking.public.intentions)
      .pipe(
        // @ts-ignore After upgrade to 6.3.2
        map((intentions: Array<string> = []) =>
          intentions
        )
      );
  }

  stakingFreeBalanceOf = (address: string): Observable<OptBN> => {
    return this.rawStorage(storage.staking.public.freeBalanceOf, address);
  }

  stakingNominatorsFor = (address: string): Observable<Array<string>> => {
    return this
      .rawStorage(storage.staking.public.nominatorsFor, address)
      .pipe(
        // @ts-ignore After upgrade to 6.3.2
        map((nominators: Array<string> = []) =>
          nominators
        )
      );
  }

  stakingNominating = (address: string): Observable<string | undefined> => {
    return this.rawStorage(storage.staking.public.nominating, address);
  }

  stakingReservedBalanceOf = (address: string): Observable<OptBN> => {
    return this.rawStorage(storage.staking.public.reservedBalanceOf, address);
  }

  timestampBlockPeriod = (): Observable<OptBN> => {
    return this.rawStorage(storage.timestamp.public.blockPeriod);
  }

  timestampNow = (): Observable<OptDate> => {
    return this.rawStorage(storage.timestamp.public.now);
  }

  systemAccountIndexOf = (address: string): Observable<OptBN> => {
    return this.rawStorage(storage.system.public.accountIndexOf, address);
  }

  validatorCount = (): Observable<OptBN> => {
    return this.rawStorage(storage.staking.public.validatorCount);
  }

  validatingBalance = (address: string): Observable<RxBalance> => {
    return this.combine(
      [
        this.votingBalance(address),
        this.votingBalancesNominatorsFor(address)
      ],
      ([balance, nominators = []]: [RxBalance, Array<RxBalance>]): RxBalance => {
        const nominatedBalance = nominators.reduce((total, nominator: RxBalance) => {
          return total.add(nominator.votingBalance);
        }, new BN(0));

        const result = {
          ...balance,
          nominators,
          nominatedBalance,
          stakingBalance: nominatedBalance.add(balance.votingBalance)
        };

        return result;
      }
    );
  }

  validatingBalances = (...addresses: Array<string>): Observable<RxBalanceMap> => {
    return this.combine(
      addresses.map((address) =>
        this.validatingBalance(address)
      ),
      (result: Array<RxBalance>): RxBalanceMap =>
        result.reduce((balances, balance) => {
          balances[balance.address] = balance;

          return balances;
        }, {} as RxBalanceMap)
    );
  }

  votingBalance = (address: string): Observable<RxBalance> => {
    return this.combine(
      [
        this.stakingFreeBalanceOf(address),
        this.stakingReservedBalanceOf(address)
      ],
      ([freeBalance = new BN(0), reservedBalance = new BN(0)]: [OptBN, OptBN]): RxBalance => ({
        address,
        freeBalance,
        nominatedBalance: new BN(0),
        reservedBalance,
        stakingBalance: new BN(0),
        votingBalance: freeBalance.add(reservedBalance)
      })
    );
  }

  votingBalancesNominatorsFor = (address: string) => {
    return this
      .stakingNominatorsFor(address)
      .pipe(
        switchMap((nominators: Array<string>) =>
          this.votingBalances(...nominators)
        ),
        defaultIfEmpty([] as any)
      );
  }

  votingBalances = (...addresses: Array<string>): Observable<RxBalance[]> => {
    return this.combine(
      addresses.map((address) =>
        this.votingBalance(address)
      )
    );
  }
}
