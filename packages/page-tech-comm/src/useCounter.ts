// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Hash } from '@polkadot/types/interfaces';

import { useApi, useCall } from '@polkadot/react-hooks';

const transformCounter = {
  transform: (proposals: Hash[]) => proposals.length
};

export default function useCounter (): number {
  const { api, isApiReady } = useApi();
  const counter = useCall<number>(isApiReady && api.query.technicalCommittee?.proposals, undefined, transformCounter) || 0;

  return counter;
}
