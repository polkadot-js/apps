// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useOwnEraRewards } from '@polkadot/react-hooks';

export default function useCounter (): number {
  const { rewardCount } = useOwnEraRewards();

  return rewardCount;
}
