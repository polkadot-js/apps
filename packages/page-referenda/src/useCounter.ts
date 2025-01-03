// Copyright 2017-2025 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletReferenda } from './types.js';

import { useMemo } from 'react';

import { createNamedHook } from '@polkadot/react-hooks';

import useReferenda from './useReferenda.js';

export function useCounterNamed (palletReferenda: PalletReferenda): number {
  const [grouped] = useReferenda(palletReferenda);

  return useMemo(
    () => grouped
      ? grouped.reduce((total, { referenda }) =>
        total + (
          referenda
            ? referenda.filter(({ info }) => info.isOngoing).length
            : 0
        ), 0)
      : 0,
    [grouped]
  );
}

function useCounterImpl (): number {
  return useCounterNamed('referenda');
}

export default createNamedHook('useCounter', useCounterImpl);
