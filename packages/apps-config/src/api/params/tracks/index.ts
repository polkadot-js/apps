// Copyright 2017-2023 @polkadot/app-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { TrackInfo } from './types';

import { KUSAMA_GENESIS } from '../../constants';
import { kusama } from './kusama';

const KNOWN_GENE_TRACKS: Record<string, Record<string, TrackInfo[]>> = {
  [KUSAMA_GENESIS]: kusama
};

const KNOWN_SPEC_TRACKS: Record<string, Record<string, TrackInfo[]>> = {
  kusama,
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
