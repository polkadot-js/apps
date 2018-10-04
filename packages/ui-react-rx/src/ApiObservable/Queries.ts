// Copyright 2017-2018 @polkadot/ui-observable authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { RxFees } from './types';

import BN from 'bn.js';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import storage from '@polkadot/storage/static';
import { AccountId, Balance, Bool, BlockNumber, Index, Moment, Perbill, PropIndex, ReferendumIndex, u32 } from '@polkadot/types/index';
import { Tuple } from '@polkadot/types/codec';

import ApiBase from './Base';
import { RxProposal, RxProposalDeposits, RxReferendum } from './classes';

// Perform storage queries to the API endpoints.
export default class ApiQueries extends ApiBase {
  accountNonce = (address: AccountId | string): Observable<Index | undefined> => {
    return this.rawStorage(storage.system.accountNonce, address);
  }

  balanceFree = (address: AccountId | string): Observable<Balance | undefined> => {
    return this.rawStorage(storage.balances.freeBalance, address);
  }

  balanceReserved = (address: AccountId | string): Observable<Balance | undefined> => {
    return this.rawStorage(storage.balances.reservedBalance, address);
  }

  blockPeriod = (): Observable<Moment | undefined> => {
    return this.rawStorage(storage.timestamp.blockPeriod);
  }

  blockNow = (): Observable<Moment | undefined> => {
    return this.rawStorage(storage.timestamp.now);
  }

  democracyLaunchPeriod = (): Observable<BlockNumber | undefined> => {
    return this.rawStorage(storage.democracy.launchPeriod);
  }

  democracyNextTally = (): Observable<ReferendumIndex | undefined> => {
    return this.rawStorage(storage.democracy.nextTally);
  }

  proposalDeposits = (proposalId: PropIndex | BN | number): Observable<RxProposalDeposits | undefined> => {
    return this
      .rawStorage(storage.democracy.depositOf, proposalId)
      .pipe(
        // @ts-ignore After upgrade to 6.3.2
        map((result: Tuple): RxProposalDeposits | undefined =>
          result
            ? new RxProposalDeposits(result)
            : undefined
        )
      );
  }

  publicProposals = (): Observable<Array<RxProposal>> => {
    return this
      .rawStorage(storage.democracy.publicProps)
      .pipe(
        // @ts-ignore After upgrade to 6.3.2
        map((proposals: Array<Tuple> = []) =>
          proposals
            .map((result: Tuple): RxProposal | undefined =>
              result
                ? new RxProposal(result)
                : undefined
            )
            .filter((proposal) =>
              proposal
            )
        )
    );
  }

  referendumCount = (): Observable<ReferendumIndex | undefined> => {
    return this.rawStorage(storage.democracy.referendumCount);
  }

  referendumInfo = (referendumId: ReferendumIndex | BN | number): Observable<RxReferendum | undefined> => {
    return this
      .rawStorage(storage.democracy.referendumInfoOf, referendumId)
      .pipe(
        // @ts-ignore After upgrade to 6.3.2
        map((result: Tuple): RxReferendum | undefined =>
          result
            ? new RxReferendum(result, referendumId)
            : undefined
        )
      );
  }

  referendumVote = (index: ReferendumIndex | BN | number, address: AccountId | string): Observable<Bool | undefined> => {
    return this.rawStorage(storage.democracy.voteOf, index, address);
  }

  referendumVoters = (index: ReferendumIndex | BN | number): Observable<Array<AccountId>> => {
    return this
      .rawStorage(storage.democracy.votersFor, index)
      .pipe(
        // @ts-ignore After upgrade to 6.3.2
        map((voters: Array<AccountId> = []) =>
          voters
        )
      );
  }

  democracyVotingPeriod = (): Observable<BlockNumber | undefined> => {
    return this.rawStorage(storage.democracy.votingPeriod);
  }

  fees = (): Observable<RxFees> => {
    return this
      .rawStorageMulti(
        [storage.balances.transactionBaseFee],
        [storage.balances.transactionByteFee],
        [storage.balances.creationFee],
        [storage.balances.existentialDeposit],
        [storage.balances.transferFee]
      )
      .pipe(
        // @ts-ignore After upgrade to 6.3.2
        map(([baseFee = new Balance(0), byteFee = new Balance(0), creationFee = new Balance(0), existentialDeposit = new Balance(0), transferFee = new Balance(0)]: [Balance | undefined, Balance | undefined, Balance | undefined, Balance | undefined, Balance | undefined]) => ({
          baseFee,
          byteFee,
          creationFee,
          existentialDeposit,
          transferFee
        }))
      );
  }

  eraLastLengthChange = (): Observable<BlockNumber | undefined> => {
    return this.rawStorage(storage.staking.lastEraLengthChange);
  }

  sessionReward = (): Observable<Perbill | undefined> => {
    return this.rawStorage(storage.staking.sessionReward);
  }

  sessionRewardCurrent = (): Observable<Balance | undefined> => {
    return this.rawStorage(storage.staking.currentSessionReward);
  }

  sessionCurrentIndex = (): Observable<BlockNumber | undefined> => {
    return this.rawStorage(storage.session.currentIndex);
  }

  sessionCurrentStart = (): Observable<Moment | undefined> => {
    return this.rawStorage(storage.session.currentStart);
  }

  sessionLastLengthChange = (): Observable<BlockNumber | undefined> => {
    return this.rawStorage(storage.session.lastLengthChange);
  }

  sessionLength = (): Observable<BlockNumber | undefined> => {
    return this.rawStorage(storage.session.sessionLength);
  }

  sessionsPerEra = (): Observable<BlockNumber | undefined> => {
    return this.rawStorage(storage.staking.sessionsPerEra);
  }

  sessionValidators = (): Observable<Array<AccountId>> => {
    return this
      .rawStorage(storage.session.validators)
      .pipe(
        // @ts-ignore After upgrade to 6.3.2
        map((validators: Array<AccountId> = []) =>
          validators
        )
      );
  }

  stakingIntentions = (): Observable<Array<AccountId>> => {
    return this
      .rawStorage(storage.staking.intentions)
      .pipe(
        // @ts-ignore After upgrade to 6.3.2
        map((intentions: Array<AccountId> = []) =>
          intentions
        )
      );
  }

  stakingNominatorsFor = (address: AccountId | string): Observable<Array<AccountId>> => {
    return this
      .rawStorage(storage.staking.nominatorsFor, address)
      .pipe(
        // @ts-ignore After upgrade to 6.3.2
        map((nominators: Array<AccountId> = []) =>
          nominators
        )
      );
  }

  stakingNominating = (address: AccountId | string): Observable<AccountId | undefined> => {
    return this.rawStorage(storage.staking.nominating, address);
  }

  validatorCount = (): Observable<u32 | undefined> => {
    return this.rawStorage(storage.staking.validatorCount);
  }
}
