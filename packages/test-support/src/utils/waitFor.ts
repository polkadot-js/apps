// Copyright 2017-2020 @polkadot/test-support authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
