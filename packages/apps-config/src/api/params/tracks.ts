// Copyright 2017-2022 @polkadot/app-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';

import { KUSAMA_GENESIS } from '../constants';

type Origins = [[number, string], Record<string, string>][];

const KUSAMA: Record<string, Origins> = {
  fellowshipReferenda: [
    [[0, 'candidates'], { Origins: 'FellowshipInitiates' }],
    [[1, 'members'], { Origins: 'Fellowship1Dan' }],
    [[2, 'proficients'], { Origins: 'Fellowship2Dan' }],
    [[3, 'fellows'], { Origins: 'Fellowship3Dan' }],
    [[4, 'senior fellows'], { Origins: 'Fellowship4Dan' }],
    [[5, 'experts'], { Origins: 'Fellowship5Dan' }],
    [[6, 'senior experts'], { Origins: 'Fellowship6Dan' }],
    [[7, 'masters'], { Origins: 'Fellowship7Dan' }],
    [[8, 'senior masters'], { Origins: 'Fellowship8Dan' }],
    [[9, 'grand masters'], { Origins: 'Fellowship9Dan' }]
  ],
  referenda: [
    [[0, 'root'], { system: 'Root' }],
    [[1, 'whitelisted_caller'], { Origins: 'WhitelistedCaller' }],
    [[10, 'staking_admin'], { Origins: 'StakingAdmin' }],
    [[11, 'treasurer'], { Origins: 'Treasurer' }],
    [[12, 'lease_admin'], { Origins: 'LeaseAdmin' }],
    [[13, 'fellowship_admin'], { Origins: 'FellowshipAdmin' }],
    [[14, 'general_admin'], { Origins: 'GeneralAdmin' }],
    [[15, 'auction_admin'], { Origins: 'AuctionAdmin' }],
    [[20, 'referendum_canceller'], { Origins: 'ReferendumCanceller' }],
    [[21, 'referendum_killer'], { Origins: 'ReferendumKiller' }],
    [[30, 'small_tipper'], { Origins: 'SmallTipper' }],
    [[31, 'big_tipper'], { Origins: 'BigTipper' }],
    [[32, 'small_spender'], { Origins: 'SmallSpender' }],
    [[33, 'medium_spender'], { Origins: 'MediumSpender' }],
    [[34, 'big_spender'], { Origins: 'BigSpender' }]
  ]
};

const KNOWN_GENE_TRACKS: Record<string, Record<string, Origins>> = {
  [KUSAMA_GENESIS]: KUSAMA
};

const KNOWN_SPEC_TRACKS: Record<string, Record<string, Origins>> = {
  kusama: KUSAMA,
  // for kitchensink, we just use the root
  node: {
    referenda: [
      [[0, 'root'], { system: 'Root' }]
    ]
  }
};

export function getGovernanceTracks (api: ApiPromise, specName: string, palletReferenda: string): Origins | undefined {
  const lookup = KNOWN_GENE_TRACKS[api.genesisHash.toHex()] || KNOWN_SPEC_TRACKS[specName];

  return lookup && lookup[palletReferenda];
}
