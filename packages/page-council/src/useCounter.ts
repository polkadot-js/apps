// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedCollectiveProposals } from '@polkadot/api-derive/types';

import { useApi, useCall } from '@polkadot/react-hooks';

function transform (motions: DerivedCollectiveProposals): number {
  return motions.filter(({ votes }): boolean => !!votes).length;
}

export default function useCounter (): number {
  const { api, isApiReady } = useApi();
  const counter = useCall<number>(isApiReady && api.derive.council?.proposals, [], {
    transform
  }) || 0;

  return counter;
}
