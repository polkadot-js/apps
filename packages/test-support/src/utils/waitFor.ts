// Copyright 2017-2021 @polkadot/test-support authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBounty } from '@polkadot/api-derive/types';

import { ApiPromise } from '@polkadot/api';

type bStatus = 'isFunded' | 'isActive';

export async function waitFor (predicate: () => boolean, { interval = 500, timeout = 10000 } = {}): Promise<boolean> {
  let elapsed = 0;

  while (!predicate()) {
    if (elapsed > timeout) {
      throw Error('Timeout');
    }

    await sleep(interval);
    elapsed += interval;
  }

  return true;
}

export const sleep = (ms: number):Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function waitForBountyState (api: ApiPromise, expectedState: bStatus, index: number, { interval = 500, timeout = 10000 } = {}): Promise<boolean> {
  let elapsed = 0;
  let bounty = await getBounty(api, index);

  while (!bounty.bounty.status[expectedState]) {
    await checkTimeoutAndSleep(elapsed, timeout, interval);
    bounty = await getBounty(api, index);
    elapsed += interval;
  }

  return true;
}

async function checkTimeoutAndSleep (elapsed: number, timeout: number, interval: number): Promise<void> {
  if (elapsed > timeout) {
    throw Error('Timeout');
  }

  await sleep(interval);
}

async function getBounty (api: ApiPromise, bountyIndex: number): Promise<DeriveBounty> {
  const bounties = await api.derive.bounties.bounties();

  return bounties.find((bounty) => (bounty.index.toNumber() === bountyIndex)) as DeriveBounty;
}

export async function waitForClaim (api: ApiPromise, index: number, { interval = 500, timeout = 10000 }: {interval: number, timeout: number}): Promise<boolean> {
  const bounty = await getBounty(api, index);
  const unlockAt = bounty.bounty.status.asPendingPayout.unlockAt;

  let bestNumber = await api.derive.chain.bestNumber();
  let elapsed = 0;

  while (unlockAt.gte(bestNumber)) {
    await checkTimeoutAndSleep(elapsed, timeout, interval);
    bestNumber = await api.derive.chain.bestNumber();
    elapsed += interval;
  }

  return true;
}
