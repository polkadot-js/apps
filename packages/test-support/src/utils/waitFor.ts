// Copyright 2017-2020 @polkadot/test-support authors & contributors
// SPDX-License-Identifier: Apache-2.0

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

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function waitForBountyState (api: ApiPromise, expectedState: bStatus, index: number, { interval = 500, timeout = 10000 } = {}): Promise<boolean> {
  let elapsed = 0;
  let bounties = await api.derive.bounties.bounties();

  while (!bounties[index].bounty.status[expectedState]) {
    if (elapsed > timeout) {
      throw Error('Timeout');
    }

    await sleep(interval);

    bounties = await api.derive.bounties.bounties();
    elapsed += interval;
  }

  return true;
}

export async function waitForClaim (api: ApiPromise, index: number, { interval = 500, timeout = 10000 }) {
  let elapsed = 0;

  const bounties = await api.derive.bounties.bounties();
  const unlockAt = bounties[0].bounty.status.asPendingPayout.unlockAt;
  let bestNumber = await api.derive.chain.bestNumber();

  while (unlockAt.gte(bestNumber)) {
    if (elapsed > timeout) {
      throw Error('Timeout');
    }

    await sleep(interval);
    bestNumber = await api.derive.chain.bestNumber();
    elapsed += interval;
  }

  return true;
}
