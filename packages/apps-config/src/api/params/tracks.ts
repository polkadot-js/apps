// Copyright 2017-2022 @polkadot/app-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';

import { KUSAMA_GENESIS } from '../constants';

interface TrackInfo {
  id: number;
  name: string;
  origin: { system: string } | { Origins: string };
  text?: string;
}

const KUSAMA: Record<string, TrackInfo[]> = {
  fellowshipReferenda: [
    {

      id: 0,
      name: 'candidates',
      origin: { Origins: 'FellowshipInitiates' }
    },
    {
      id: 1,
      name: 'members',
      origin: { Origins: 'Fellowship1Dan' }
    },
    {
      id: 2,
      name: 'proficients',
      origin: { Origins: 'Fellowship2Dan' }
    },
    {
      id: 3,
      name: 'fellows',
      origin: { Origins: 'Fellowship3Dan' }
    },
    {
      id: 4,
      name: 'senior fellows',
      origin: { Origins: 'Fellowship4Dan' }
    },
    {
      id: 5,
      name: 'experts',
      origin: { Origins: 'Fellowship5Dan' }
    },
    {
      id: 6,
      name: 'senior experts',
      origin: { Origins: 'Fellowship6Dan' }
    },
    {
      id: 7,
      name: 'masters',
      origin: { Origins: 'Fellowship7Dan' }
    },
    {
      id: 8,
      name: 'senior masters',
      origin: { Origins: 'Fellowship8Dan' }
    },
    {
      id: 9,
      name: 'grand masters',
      origin: { Origins: 'Fellowship9Dan' }
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
      text: 'Origin commanded by any members of the Polkadot Fellowship (no Dan grade needed)'
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

const KNOWN_GENE_TRACKS: Record<string, Record<string, TrackInfo[]>> = {
  [KUSAMA_GENESIS]: KUSAMA
};

const KNOWN_SPEC_TRACKS: Record<string, Record<string, TrackInfo[]>> = {
  kusama: KUSAMA,
  // for kitchensink, we just use the root
  node: {
    referenda: [
      {
        id: 0,
        name: 'root',
        origin: { system: 'Root' }
      }
    ]
  }
};

export function getGovernanceTracks (api: ApiPromise, specName: string, palletReferenda: string): TrackInfo[] | undefined {
  const lookup = KNOWN_GENE_TRACKS[api.genesisHash.toHex()] || KNOWN_SPEC_TRACKS[specName];

  return lookup && lookup[palletReferenda];
}
