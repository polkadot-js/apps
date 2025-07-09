// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { BabeGenesisConfiguration } from '@polkadot/types/interfaces/babe';

import { useMemo } from 'react';

import { BN, BN_THOUSAND, BN_TWO, bnMin } from '@polkadot/util';

import { createNamedHook } from './createNamedHook.js';
import { useApi } from './useApi.js';
import { A_DAY } from './useBlocksPerDays.js';
import { useCall } from './useCall.js';

// Some chains incorrectly use these, i.e. it is set to values such as 0 or even 2
// Use a low minimum validity threshold to check these against
const THRESHOLD = BN_THOUSAND.div(BN_TWO);
const DEFAULT_TIME = new BN(6_000);

function calcInterval (api: ApiPromise): BN {
  return bnMin(A_DAY, (
    // Babe, e.g. Relay chains (Substrate defaults)
    api.consts.babe?.expectedBlockTime ||
    // POW, eg. Kulupu
    api.consts.difficulty?.targetBlockTime ||
    // Subspace
    api.consts.subspace?.expectedBlockTime || (
      // Check against threshold to determine value validity
      api.consts.timestamp?.minimumPeriod.gte(THRESHOLD)
        // Default minimum period config
        ? api.consts.timestamp.minimumPeriod.mul(BN_TWO)
        : api.query.parachainSystem
          // default guess for a parachain
          ? api.consts.aura?.slotDuration ?? DEFAULT_TIME.mul(BN_TWO)
          // default guess for others
          : DEFAULT_TIME
    )
  ));
}

function useBlockIntervalImpl (apiOverride?: ApiPromise | null): BN {
  const { api } = useApi();

  const currApi = apiOverride || api;
  const blockTimeAura = useCall<BN>(currApi.call.auraApi?.slotDuration && currApi.call.auraApi.slotDuration, []);
  const blockTimeBabe = useCall(currApi.call.babeApi?.configuration && currApi.call.babeApi.configuration, [], {
    transform: (data: BabeGenesisConfiguration | undefined) => data?.slotDuration
  });

  return useMemo(
    () => (blockTimeAura || blockTimeBabe) ?? calcInterval(currApi),
    [blockTimeAura, blockTimeBabe, currApi]
  );
}

export const useBlockInterval = createNamedHook('useBlockInterval', useBlockIntervalImpl);
