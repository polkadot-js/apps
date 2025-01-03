// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Option, StorageKey } from '@polkadot/types';
import type { PalletBrokerRegionId, PalletBrokerRegionRecord } from '@polkadot/types/lookup';
import type { RegionInfo } from './types.js';

import { useEffect, useState } from 'react';

import { createNamedHook, useCall, useMapKeys } from '@polkadot/react-hooks';

function extractInfo (core: number, start: number, end: number, owner: string, paid: string, mask: `0x${string}`) {
  return {
    core,
    end,
    mask,
    owner,
    paid,
    start
  };
}

const OPT_KEY = {
  transform: (keys: StorageKey<[PalletBrokerRegionId]>[]): PalletBrokerRegionId[] =>
    keys.map(({ args: [regionId] }) => regionId)
};

function useRegionsImpl (api: ApiPromise): RegionInfo[] | undefined {
  const regionKeys = useMapKeys(api?.query?.broker.regions, [], OPT_KEY);

  const regionInfo = useCall<[[PalletBrokerRegionId[]], Option<PalletBrokerRegionRecord>[]]>(api?.query?.broker.regions.multi, [regionKeys], { withParams: true });

  const [state, setState] = useState<RegionInfo[] | undefined>();

  useEffect((): void => {
    regionInfo &&
      regionInfo[0][0].length > 0 &&
      setState(
        regionInfo[0][0].map((info, index) =>
          extractInfo(info.core.toNumber(), info.begin.toNumber(), regionInfo[1][index].unwrap().end.toNumber(), regionInfo[1][index].unwrap().owner.toString(), regionInfo[1][index].unwrap().paid.toString(), info.mask.toHex())
        )
      );
  }, [regionInfo]);

  return state;
}

export const useRegions = createNamedHook('useRegions', useRegionsImpl);
