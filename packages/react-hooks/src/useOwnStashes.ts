// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Option } from '@polkadot/types';
import type { AccountId, StakingLedger } from '@polkadot/types/interfaces';

import { useMemo } from 'react';

import { createNamedHook } from './createNamedHook.js';
import { useAccounts } from './useAccounts.js';
import { useApi } from './useApi.js';
import { useCall } from './useCall.js';

type IsInKeyring = boolean;

function getStashes (allAccounts: string[], ownBonded: Option<AccountId>[], ownLedger: Option<StakingLedger>[]): [string, IsInKeyring][] {
  const result: [string, IsInKeyring][] = [];

  ownBonded.forEach((value, index): void => {
    value.isSome && result.push([allAccounts[index], true]);
  });

  ownLedger.forEach((ledger): void => {
    if (ledger.isSome) {
      const stashId = ledger.unwrap().stash.toString();

      !result.some(([accountId]) => accountId === stashId) && result.push([stashId, false]);
    }
  });

  return result;
}

function useOwnStashesImpl (additional?: string[], apiOverride?: ApiPromise): [string, IsInKeyring][] | undefined {
  const { allAccounts } = useAccounts();
  const { api: connectedApi } = useApi();
  const api = useMemo(() => apiOverride ?? connectedApi, [apiOverride, connectedApi]);

  const ids = useMemo(
    () => allAccounts.concat(additional || []),
    [allAccounts, additional]
  );

  const ownBonded = useCall<Option<AccountId>[]>(ids.length !== 0 && api.query.staking?.bonded.multi, [ids]);
  const ownLedger = useCall<Option<StakingLedger>[]>(ids.length !== 0 && api.query.staking?.ledger.multi, [ids]);

  return useMemo(
    () => ids.length
      ? ownBonded && ownLedger
        ? getStashes(ids, ownBonded, ownLedger)
        : undefined
      : [],
    [ids, ownBonded, ownLedger]
  );
}

export const useOwnStashes = createNamedHook('useOwnStashes', useOwnStashesImpl);

function useOwnStashIdsImpl (additional?: string[]): string[] | undefined {
  const ownStashes = useOwnStashes(additional);

  return useMemo(
    () => ownStashes
      ? ownStashes.map(([stashId]) => stashId)
      : undefined,
    [ownStashes]
  );
}

export const useOwnStashIds = createNamedHook('useOwnStashIds', useOwnStashIdsImpl);
