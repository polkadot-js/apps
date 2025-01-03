// Copyright 2017-2025 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { u32 } from '@polkadot/types';
import type { PalletReferenda, ReferendaGroup, Summary } from './types.js';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

function calcActive (grouped: ReferendaGroup[] = []): number {
  return grouped.reduce((total, { referenda = [] }) =>
    total + referenda.filter((r) =>
      r.info.isOngoing
    ).length,
  0);
}

function useSummaryImpl (palletReferenda: PalletReferenda, grouped?: ReferendaGroup[] | undefined): Summary {
  const { api } = useApi();
  const refCount = useCall<u32>(api.query[palletReferenda].referendumCount);
  const refActive = useMemo(
    () => calcActive(grouped),
    [grouped]
  );

  return useMemo(
    () => ({ refActive, refCount }),
    [refActive, refCount]
  );
}

export default createNamedHook('useSummary', useSummaryImpl);
