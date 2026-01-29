// Copyright 2017-2025 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletReferendaTrackDetails } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { PalletReferenda, TrackDescription } from './types.js';

import { useMemo } from 'react';

import { createNamedHook, useApi } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

import { calcCurves } from './util.js';

const zeroGraph = { approval: [BN_ZERO], support: [BN_ZERO], x: [BN_ZERO] };

function expandTracks (tracks: [BN, PalletReferendaTrackDetails][]): TrackDescription[] {
  return tracks.map(([id, info]) => ({
    graph: info.decisionDeposit && info.minApproval && info.minSupport ? calcCurves(info) : zeroGraph,
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
