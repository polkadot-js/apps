// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId } from '@polkadot/types/interfaces';

import { createNamedHook, useApi, useCallMulti } from '@polkadot/react-hooks';

const options = {};

function usePoolInfoImpl (id: AccountId) {
  const { api } = useApi();

  return useCallMulti([
    [api.query.nominatorPools.bondedPools, id],
    [api.query.nominatorPools.rewardPools, id]
  ], options);
}

export default createNamedHook('usePoolInfo', usePoolInfoImpl);
