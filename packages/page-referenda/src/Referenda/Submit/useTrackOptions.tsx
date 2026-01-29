// Copyright 2017-2025 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { BN } from '@polkadot/util';
import type { TrackDescription } from '../../types.js';
import type { TrackOption } from './types.js';

import React, { useMemo } from 'react';

import { createNamedHook, useApi } from '@polkadot/react-hooks';
import { bnToBn } from '@polkadot/util';

import { getTrackInfo, getTrackName } from '../../util.js';

function getTrackOptions (api: ApiPromise, specName: string, palletReferenda: string, tracks: TrackDescription[], include?: (BN | number)[], exclude?: (BN | number)[]): TrackOption[] {
  const includeBn = include?.map((v) => bnToBn(v));
  const excludeBn = exclude?.map((v) => bnToBn(v));

  return tracks
    .filter(({ id }) =>
      (
        !includeBn ||
        includeBn.some((v) => v.eq(id))
      ) && (
        !excludeBn ||
        !excludeBn.some((v) => v.eq(id))
      )
    )
    .map(({ id, info }): TrackOption => {
      const trackInfo = getTrackInfo(api, specName, palletReferenda, tracks, id.toNumber());
      const trackName = getTrackName(id, info);

      return {
        text: trackInfo?.text
          ? (
            <div className='trackOption'>
              <div className='normal'>{trackName}</div>
              <div className='faded'>{trackInfo.text}</div>
            </div>
          )
          : trackName,
        value: id.toNumber()
      };
    });
}

function useTrackOptionsImpl (palletReferenda: string, tracks: TrackDescription[], include?: (BN | number)[], exclude?: (BN | number)[]): TrackOption[] {
  const { api, specName } = useApi();

  return useMemo(
    () => getTrackOptions(api, specName, palletReferenda, tracks, include, exclude),
    [api, exclude, include, palletReferenda, specName, tracks]
  );
}

export default createNamedHook('useTrackOptions', useTrackOptionsImpl);
