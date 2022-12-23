// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletReferendaTrackInfo } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { PalletReferenda, TrackDescription } from './types';

import { useMemo } from 'react';

import { createNamedHook, useApi } from '@polkadot/react-hooks';

import { calcCurves } from './util';

function expandTracks (tracks?: [BN, PalletReferendaTrackInfo][]): TrackDescription[] | undefined {
  if (tracks) {
    return tracks.map(([id, info]) => ({
      graph: calcCurves(info),
      id,
      info
    }));
  }

  return undefined;
}

function useTracksImpl (palletReferenda: PalletReferenda): TrackDescription[] | undefined {
  const { api, isApiReady } = useApi();

  return useMemo(
    () => isApiReady
      ? expandTracks(api.consts[palletReferenda as 'referenda'] && api.consts[palletReferenda as 'referenda'].tracks)
      : undefined,
    [api, isApiReady, palletReferenda]
  );
}

export default createNamedHook('useTraqcks', useTracksImpl);
