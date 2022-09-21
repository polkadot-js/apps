// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { u32 } from '@polkadot/types';
import type { PalletReferenda, ReferendaGroup, Summary } from './types';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

// TODO keep track of all tracks to get the number of deciding
function useSummaryImpl (palletReferenda: PalletReferenda, grouped?: ReferendaGroup[] | undefined): Summary {
  const { api } = useApi();
  const refCount = useCall<u32>(api.query[palletReferenda].referendumCount);
  const refActive = useMemo(
    () => grouped && grouped.reduce((total, { referenda }) => total + (referenda ? referenda.length : 0), 0),
    [grouped]
  );

  return useMemo(
    () => ({ refActive, refCount }),
    [refActive, refCount]
  );
}

export default createNamedHook('useSummary', useSummaryImpl);
