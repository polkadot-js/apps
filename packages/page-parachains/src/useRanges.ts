// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { u32 } from '@polkadot/types';

import { useMemo } from 'react';

import { useApi } from '@polkadot/react-hooks';

const RANGES_DEFAULT: [number, number][] = [
  [0, 0], [0, 1], [0, 2], [0, 3],
  [1, 1], [1, 2], [1, 3],
  [2, 2], [2, 3],
  [3, 3]
];

function isU32 (leasePeriodsPerSlot: unknown): leasePeriodsPerSlot is u32 {
  return !!leasePeriodsPerSlot;
}

export default function useRanges (): [number, number][] {
  const { api } = useApi();

  return useMemo(
    (): [number, number][] => {
      if (isU32(api.consts.auctions?.leasePeriodsPerSlot)) {
        const ranges: [number, number][] = [];

        for (let i = 0; api.consts.auctions.leasePeriodsPerSlot.gtn(i); i++) {
          for (let j = i; api.consts.auctions.leasePeriodsPerSlot.gtn(j); j++) {
            ranges.push([i, j]);
          }
        }

        return ranges;
      }

      return RANGES_DEFAULT;
    },
    [api]
  );
}
