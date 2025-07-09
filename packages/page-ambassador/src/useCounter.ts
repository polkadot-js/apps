// Copyright 2017-2025 @polkadot/app-ranked authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCounterNamed } from '@polkadot/app-referenda/useCounter';
import { createNamedHook } from '@polkadot/react-hooks';

function useCounterImpl (): number {
  return useCounterNamed('ambassadorReferenda');
}

export default createNamedHook('useCounter', useCounterImpl);
