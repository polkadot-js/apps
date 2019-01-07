// Copyright 2017-2019 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CombinatorFunction } from '@polkadot/api/promise/Combinator';
import { UnsubFunction } from '@polkadot/api/promise/types';
import { DeriveSubscription, DerivedReferendumVote } from '../types';

import BN from 'bn.js';
import ApiPromise from '@polkadot/api/promise';
import { AccountId, Balance, Vote } from '@polkadot/types';

import votingBalances from '../balances/votingBalances';
import votes from './votes';

export default function referendumVotesFor (api: ApiPromise): DeriveSubscription {
  return (referendumId: BN | number, cb: (votes: Array<DerivedReferendumVote>) => any): UnsubFunction => {
    let innerDestroy: UnsubFunction | undefined;
    const outerDestroy = api.query.democracy.votersFor(referendumId, (votersFor: Array<AccountId>) => {
      if (innerDestroy) {
        innerDestroy();
        innerDestroy = undefined;
      }

      if (!votersFor || !votersFor.length) {
        return cb([]);
      }

      innerDestroy = api.combineLatest([
        [votes(api), referendumId, ...votersFor] as [CombinatorFunction, ...Array<any>],
        [votingBalances(api), ...votersFor] as [CombinatorFunction, ...Array<any>]
      ], ([votes, balances]) =>
        cb(
          votersFor.map((accountId, index): DerivedReferendumVote => ({
            accountId,
            balance: balances[index].votingBalance || new Balance(0),
            vote: votes[index] || new Vote(0)
          }))
        )
      );
    });

    return (): void => {
      if (innerDestroy) {
        innerDestroy();
      }

      outerDestroy();
    };
  };
}
