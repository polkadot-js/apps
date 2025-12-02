// Copyright 2017-2025 @polkadot/app-reputation-voting authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createNamedHook } from '@polkadot/react-hooks';

import useReferenda from './useReferenda.js';

function useCounterImpl (): number {
  const referenda = useReferenda();

  return referenda?.filter((r) => r.info.isOngoing).length || 0;
}

export default createNamedHook('useCounter', useCounterImpl);
