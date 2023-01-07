// Copyright 2017-2023 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { TrackDescription } from '../../types';
import type { TrackOption } from './types';

import React, { useMemo } from 'react';

import { createNamedHook, useApi } from '@polkadot/react-hooks';

import { getTrackInfo, getTrackName } from '../../util';

function getTrackOptions (api: ApiPromise, specName: string, palletReferenda: string, tracks?: TrackDescription[]): TrackOption[] | undefined {
  return tracks && tracks.map(({ id, info }): TrackOption => {
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

function useTrackOptionsImpl (palletReferenda: string, tracks?: TrackDescription[]): TrackOption[] | null {
  const { api, specName } = useApi();

  return useMemo(
    () => getTrackOptions(api, specName, palletReferenda, tracks) || null,
    [api, palletReferenda, specName, tracks]
  );
}

export default createNamedHook('useTrackOptions', useTrackOptionsImpl);
