// Copyright 2017-2022 @polkadot/app-ranked authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCounterNamed } from '@polkadot/app-referenda/useCounter';
import { createNamedHook } from '@polkadot/react-hooks';

function useCounterImpl (): number {
  return useCounterNamed('rankedPolls');
}

export default createNamedHook('useCounter', useCounterImpl);
