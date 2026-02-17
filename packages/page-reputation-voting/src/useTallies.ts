// Copyright 2017-2025 @polkadot/app-reputation-voting authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { ReputationTally } from './types.js';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

export type TallyMap = Map<string, ReputationTally>;

interface TalliesResult {
  tallies: TallyMap;
  isLoading: boolean;
}

const OPT_MULTI = {
  transform: ([[ids], all]: [[BN[]], (ReputationTally | null)[]]): TallyMap => {
    const map = new Map<string, ReputationTally>();

    ids.forEach((id, i) => {
      const tally = all[i];

      if (tally) {
        map.set(id.toString(), tally);
      }
    });

    return map;
  },
  withParamsTransform: true
};

function useTalliesImpl (referendumIds: BN[] | undefined): TalliesResult {
  const { api } = useApi();

  const tallies = useCall<TallyMap>(
    referendumIds && referendumIds.length > 0 && api.query.reputationVoting?.tallyOf?.multi,
    [referendumIds],
    OPT_MULTI
  );

  return useMemo(
    () => ({
      isLoading: referendumIds !== undefined && referendumIds.length > 0 && !tallies,
      tallies: tallies || new Map()
    }),
    [referendumIds, tallies]
  );
}

export default createNamedHook('useTallies', useTalliesImpl);
