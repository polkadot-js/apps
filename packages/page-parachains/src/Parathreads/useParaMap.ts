// Copyright 2017-2022 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { AccountId, BalanceOf, ParaId } from '@polkadot/types/interfaces';
import type { ITuple } from '@polkadot/types/types';
import type { LeaseInfo } from '../types';

import { useCallback } from 'react';

import { createNamedHook, useApi, useCall, useIsParasLinked } from '@polkadot/react-hooks';

type Result = [ParaId, LeaseInfo[]][];

function extractParaMap (hasLinksMap: Record<string, boolean>, paraIds: ParaId[], leases: Option<ITuple<[AccountId, BalanceOf]>>[][]): Result {
  return paraIds
    .reduce((all: Result, id, index): Result => {
      all.push([
        id,
        leases[index]
          .map((optLease, period): LeaseInfo | null => {
            if (optLease.isNone) {
              return null;
            }

            const [accountId, balance] = optLease.unwrap();

            return {
              accountId,
              balance,
              period
            };
          })
          .filter((item): item is LeaseInfo => !!item)
      ]);

      return all;
    }, [])
    .sort(([aId, aLeases], [bId, bLeases]): number => {
      const aKnown = hasLinksMap[aId.toString()] || false;
      const bKnown = hasLinksMap[bId.toString()] || false;

      return aLeases.length && bLeases.length
        ? (aLeases[0].period - bLeases[0].period) || aId.cmp(bId)
        : aLeases.length
          ? -1
          : bLeases.length
            ? 1
            : aKnown === bKnown
              ? aId.cmp(bId)
              : aKnown
                ? -1
                : 1;
    });
}

function useParaMapImpl (ids?: ParaId[]): Result | undefined {
  const { api } = useApi();
  const hasLinksMap = useIsParasLinked(ids);
  const transform = useCallback(
    ([[paraIds], leases]: [[ParaId[]], Option<ITuple<[AccountId, BalanceOf]>>[][]]): Result =>
      extractParaMap(hasLinksMap, paraIds, leases),
    [hasLinksMap]
  );

  return useCall<Result>(ids && api.query.slots.leases.multi, [ids], {
    transform,
    withParamsTransform: true
  });
}

export default createNamedHook('useParaMap', useParaMapImpl);
