// Copyright 2017-2025 @polkadot/test-support authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { DeriveBounty } from '@polkadot/api-derive/types';
import type { WaitOptions } from '@polkadot/test-support/types';

import { waitFor } from '@polkadot/test-support/utils';

type bStatus = 'isFunded' | 'isActive';

async function getBounty (api: ApiPromise, bountyIndex: number): Promise<DeriveBounty> {
  const bounties = await api.derive.bounties.bounties();
  const bounty = bounties.find((bounty) => bounty.index.toNumber() === bountyIndex);

  if (!bounty) {
    throw new Error('Unable to find bounty');
  }

  return bounty;
}

export async function waitForBountyState (api: ApiPromise, expectedState: bStatus, index: number, { interval = 500,
  timeout = 10000 } = {}): Promise<boolean> {
  return waitFor(async () => {
    const bounty = await getBounty(api, index);

    return bounty.bounty.status[expectedState];
  }, { interval, timeout });
}

export async function waitForClaim (api: ApiPromise, index: number, { interval = 500, timeout = 10000 }: WaitOptions): Promise<boolean> {
  return waitFor(async () => {
    const bounty = await getBounty(api, index);
    const unlockAt = bounty.bounty.status.asPendingPayout.unlockAt;

    const bestNumber = await api.derive.chain.bestNumber();

    return unlockAt.lt(bestNumber);
  }, { interval, timeout });
}
