// Copyright 2017-2021 @polkadot/app-tech-comm authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Hash } from '@polkadot/types/interfaces';

import { useApi, useCall } from '@polkadot/react-hooks';

const transformCounter = {
  transform: (proposals: Hash[]) => proposals.length
};

export default function useCounter (): number {
  const { api, isApiReady } = useApi();
  const counter = useCall<number>(isApiReady && api.derive.technicalCommittee?.proposals, undefined, transformCounter) || 0;

  return counter;
}
