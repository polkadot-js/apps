// Copyright 2017-2021 @polkadot/test-support authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ApiPromise } from '@polkadot/api';
import { DeriveBounty } from '@polkadot/api-derive/types';
import { waitFor, WaitOptions } from '@polkadot/test-support/utils/waitFor';

type bStatus = 'isFunded' | 'isActive';

async function getBounty (api: ApiPromise, bountyIndex: number): Promise<DeriveBounty> {
  const bounties = await api.derive.bounties.bounties();

  return bounties.find((bounty) => (bounty.index.toNumber() === bountyIndex)) as DeriveBounty;
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
