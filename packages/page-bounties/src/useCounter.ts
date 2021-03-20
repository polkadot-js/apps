// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';

import { DeriveBounties } from '@polkadot/api-derive/types';
import { useApi, useCall } from '@polkadot/react-hooks';

export default function useCounter (): number {
  const { api, isApiReady } = useApi();
  const bounties = useCall<DeriveBounties>(isApiReady && api.derive.bounties?.bounties);

  return useMemo(
    () => bounties?.length || 0,
    [bounties]
  );
}
