// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { u32 } from '@polkadot/types';
import type { PalletReferenda, Summary } from './types';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

// TODO keep track of all tracks to get the number of deciding
function useSummaryImpl (palletReferenda: PalletReferenda): Summary {
  const { api } = useApi();
  const refCount = useCall<u32>(api.query[palletReferenda].referendumCount);

  return useMemo(
    () => ({ refCount }),
    [refCount]
  );
}

export default createNamedHook('useSummary', useSummaryImpl);
