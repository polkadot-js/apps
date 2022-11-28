// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletReferendaTrackInfo } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { PalletReferenda } from './types';

import { useMemo } from 'react';

import { createNamedHook, useApi } from '@polkadot/react-hooks';

function useTracksImpl (palletReferenda: PalletReferenda): [BN, PalletReferendaTrackInfo][] | undefined {
  const { api, isApiReady } = useApi();

  return useMemo(
    () => isApiReady
      ? api.consts[palletReferenda as 'referenda'] && api.consts[palletReferenda as 'referenda'].tracks
      : undefined,
    [api, isApiReady, palletReferenda]
  );
}

export default createNamedHook('useTraqcks', useTracksImpl);
