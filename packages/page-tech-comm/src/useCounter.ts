// Copyright 2017-2025 @polkadot/app-tech-comm authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Hash } from '@polkadot/types/interfaces';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

const OPT = {
  transform: (proposals: Hash[]) => proposals.length
};

function useCounterImpl (): number {
  const { api, isApiReady } = useApi();
  const counter = useCall<number>(isApiReady && api.derive.technicalCommittee?.proposals, undefined, OPT) || 0;

  return counter;
}

export default createNamedHook('useCounter', useCounterImpl);
