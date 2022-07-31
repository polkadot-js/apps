// Copyright 2017-2022 @polkadot/app-ranked authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletPoll } from './types';

import { useCounterNamed } from '@polkadot/app-referenda/useCounter';
import { createNamedHook } from '@polkadot/react-hooks';

function useRefCounterImpl (collective: PalletPoll): number {
  return useCounterNamed(collective);
}

export default createNamedHook('useRefCounter', useRefCounterImpl);
