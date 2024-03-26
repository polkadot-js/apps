// Copyright 2017-2024 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletReferendaTrackInfo } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { PalletReferenda, TrackDescription } from './types.js';

import { useMemo } from 'react';

import { createNamedHook, useApi } from '@polkadot/react-hooks';

import { calcCurves } from './util.js';

function expandTracks (tracks: [BN, PalletReferendaTrackInfo][]): TrackDescription[] {
  return tracks.map(([id, info]) => ({
    graph: calcCurves(info),
    id,
    info
  }));
}

function useTracksImpl (palletReferenda: PalletReferenda): TrackDescription[] {
  const { api } = useApi();

  return useMemo(
    () => expandTracks(api.consts[palletReferenda as 'referenda'].tracks),
    [api, palletReferenda]
  );
}

export default createNamedHook('useTracks', useTracksImpl);
