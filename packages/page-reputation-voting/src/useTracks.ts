// Copyright 2017-2025 @polkadot/app-reputation-voting authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import { useMemo } from 'react';

import { createNamedHook, useApi } from '@polkadot/react-hooks';

export interface TrackDescription {
  id: BN;
  name: string;
}

function useTracksImpl (): TrackDescription[] {
  const { api } = useApi();

  return useMemo(
    () => {
      try {
        const tracks = api.consts.referenda?.tracks;

        if (tracks) {
          return tracks.map(([id, info]) => ({
            id,
            name: info.name.toString()
          }));
        }
      } catch {
        // ignore errors
      }

      return [];
    },
    [api]
  );
}

export default createNamedHook('useTracks', useTracksImpl);
