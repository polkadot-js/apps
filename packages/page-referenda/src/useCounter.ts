// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletReferenda } from './types';

import { useMemo } from 'react';

import { createNamedHook } from '@polkadot/react-hooks';

import useReferenda from './useReferenda';

export function useCounterNamed (palletReferenda: PalletReferenda): number {
  const [referanda] = useReferenda(palletReferenda);

  return useMemo(
    () => (referanda && referanda.filter(({ info }) => info.isOngoing).length) || 0,
    [referanda]
  );
}

function useCounterImpl (): number {
  return useCounterNamed('referenda');
}

export default createNamedHook('useCounter', useCounterImpl);
