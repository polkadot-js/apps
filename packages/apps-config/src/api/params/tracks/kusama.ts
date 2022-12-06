// Copyright 2017-2022 @polkadot/app-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { TrackInfo } from './types';

function compareFellowshipRank (trackId: number): (rank: BN) => boolean {
  return (rank: BN): boolean =>
    rank.gten(trackId);
}

export const kusama: Record<string, TrackInfo[]> = {
  fellowshipReferenda: [
    {
      compare: compareFellowshipRank(0),
      id: 0,
      name: 'candidates',
      origin: { Origins: 'FellowshipInitiates' },
      text: 'Origin commanded by any members of the Polkadot Fellowship (no Dan grade needed)'
    },
    {
      compare: compareFellowshipRank(1),
      id: 1,
      name: 'members',
      origin: { Origins: 'Fellowship1Dan' },
      text: 'Origin commanded by rank 1 of the Polkadot Fellowship and with a success of 1'
    },
    {
      compare: compareFellowshipRank(2),
      id: 2,
      name: 'proficients',
      origin: { Origins: 'Fellowship2Dan' },
      text: 'Origin commanded by rank 2 of the Polkadot Fellowship and with a success of 2'
    },
    {

      compare: compareFellowshipRank(3),
      id: 3,
      name: 'fellows',
      origin: [
        { Origins: 'Fellowship3Dan' },
        { Origins: 'Fellows' }
      ],
      text: 'Origin commanded by Polkadot Fellows (3rd Dan fellows or greater)'
    },
    {
      compare: compareFellowshipRank(4),
      id: 4,
      name: 'senior fellows',
      origin: { Origins: 'Fellowship4Dan' },
      text: 'Origin commanded by rank 4 of the Polkadot Fellowship and with a success of 4'
    },
    {
      compare: compareFellowshipRank(5),
      id: 5,
      name: 'experts',
      origin: [
        { Origins: 'Fellowship5Dan' },
        { Origins: 'FellowshipExperts' }
      ],
      text: 'Origin commanded by Polkadot Experts (5th Dan fellows or greater)'
    },
    {
      compare: compareFellowshipRank(6),
      id: 6,
      name: 'senior experts',
      origin: { Origins: 'Fellowship6Dan' },
      text: 'Origin commanded by rank 6 of the Polkadot Fellowship and with a success of 6'
    },
    {
      compare: compareFellowshipRank(7),
      id: 7,
      name: 'masters',
      origin: [
        { Origins: 'Fellowship7Dan' },
        { Origins: 'FellowshipMasters' }
      ],
      text: 'Origin commanded by Polkadot Masters (7th Dan fellows of greater)'
    },
    {
      compare: compareFellowshipRank(8),
      id: 8,
      name: 'senior masters',
      origin: { Origins: 'Fellowship8Dan' },
      text: 'Origin commanded by rank 8 of the Polkadot Fellowship and with a success of 8'
    },
    {
      compare: compareFellowshipRank(9),
      id: 9,
      name: 'grand masters',
      origin: { Origins: 'Fellowship9Dan' },
      text: 'Origin commanded by rank 9 of the Polkadot Fellowship and with a success of 9'
    }
  ],
  referenda: [
    {
      id: 0,
      name: 'root',
      origin: { system: 'Root' }
    },
    {
      id: 1,
      name: 'whitelisted_caller',
      origin: { Origins: 'WhitelistedCaller' },
      text: 'Origin able to dispatch a whitelisted call'
    },
    {
      id: 10,
      name: 'staking_admin',
      origin: { Origins: 'StakingAdmin' },
      text: 'Origin for cancelling slashes'
    },
    {
      id: 11,
      name: 'treasurer',
      origin: { Origins: 'Treasurer' },
      text: 'Origin for spending (any amount of) funds'
    },
    {
      id: 12,
      name: 'lease_admin',
      origin: { Origins: 'LeaseAdmin' },
      text: 'Origin able to force slot leases'
    },
    {
      id: 13,
      name: 'fellowship_admin',
      origin: { Origins: 'FellowshipAdmin' },
      text: 'Origin for managing the composition of the fellowship'
    },
    {
      id: 14,
      name: 'general_admin',
      origin: { Origins: 'GeneralAdmin' },
      text: 'Origin for managing the registrar'
    },
    {
      id: 15,
      name: 'auction_admin',
      origin: { Origins: 'AuctionAdmin' },
      text: 'Origin for starting auctions'
    },
    {
      id: 20,
      name: 'referendum_canceller',
      origin: { Origins: 'ReferendumCanceller' },
      text: 'Origin able to cancel referenda'
    },
    {
      id: 21,
      name: 'referendum_killer',
      origin: { Origins: 'ReferendumKiller' },
      text: 'Origin able to kill referenda'
    },
    {
      id: 30,
      name: 'small_tipper',
      origin: { Origins: 'SmallTipper' },
      text: 'Origin able to spend up to 1 KSM from the treasury at once'
    },
    {
      id: 31,
      name: 'big_tipper',
      origin: { Origins: 'BigTipper' },
      text: 'Origin able to spend up to 5 KSM from the treasury at once'
    },
    {
      id: 32,
      name: 'small_spender',
      origin: { Origins: 'SmallSpender' },
      text: 'Origin able to spend up to 50 KSM from the treasury at once'
    },
    {
      id: 33,
      name: 'medium_spender',
      origin: { Origins: 'MediumSpender' },
      text: 'Origin able to spend up to 500 KSM from the treasury at once'
    },
    {
      id: 34,
      name: 'big_spender',
      origin: { Origins: 'BigSpender' },
      text: 'Origin able to spend up to 5,000 KSM from the treasury at once'
    }
  ]
};
