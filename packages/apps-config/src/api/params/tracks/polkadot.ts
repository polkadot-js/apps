// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TrackInfo } from './types.js';

import { BN } from '@polkadot/util';

import { compareFellowshipRank, formatSpendFactory } from './util.js';

// hardcoded here since this is static (hopefully no re-denomination anytime...)
const formatSpend = formatSpendFactory({
  decimals: 10,
  forceUnit: '-',
  withSi: true,
  withUnit: 'DOT'
});

// https://github.com/paritytech/polkadot/blob/6e3f2c5b4b6e6927915de2f784e1d831717760fa/runtime/kusama/constants/src/lib.rs#L28-L32
const UNITS = new BN(10_000_000_000);
const DOLLARS = UNITS;
const GRAND = DOLLARS.muln(1_000);

// https://github.com/paritytech/polkadot/blob/6e3f2c5b4b6e6927915de2f784e1d831717760fa/runtime/kusama/src/governance/origins.rs#L170-L179
const SPEND_LIMITS = {
  BigSpender: formatSpend(1_000, GRAND),
  BigTipper: formatSpend(1, GRAND),
  MediumSpender: formatSpend(100, GRAND),
  SmallSpender: formatSpend(10, GRAND),
  SmallTipper: formatSpend(250, DOLLARS),
  Treasurer: formatSpend(10_000, GRAND)
};

export const polkadot: Record<string, TrackInfo[]> = {
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
      origin: { system: 'Root' },
      text: 'Origin for the system root'
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
      text: `Origin able to spend up to ${SPEND_LIMITS.SmallTipper} from the treasury at once`
    },
    {
      id: 31,
      name: 'big_tipper',
      origin: { Origins: 'BigTipper' },
      text: `Origin able to spend up to ${SPEND_LIMITS.BigTipper} from the treasury at once`
    },
    {
      id: 32,
      name: 'small_spender',
      origin: { Origins: 'SmallSpender' },
      text: `Origin able to spend up to ${SPEND_LIMITS.SmallSpender} from the treasury at once`
    },
    {
      id: 33,
      name: 'medium_spender',
      origin: { Origins: 'MediumSpender' },
      text: `Origin able to spend up to ${SPEND_LIMITS.MediumSpender} from the treasury at once`
    },
    {
      id: 34,
      name: 'big_spender',
      origin: { Origins: 'BigSpender' },
      text: `Origin able to spend up to ${SPEND_LIMITS.BigSpender} from the treasury at once`
    }
  ]
};
