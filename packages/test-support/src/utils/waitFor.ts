// Copyright 2017-2025 @polkadot/test-support authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { WaitOptions } from '../types.js';

export async function waitFor (predicate: () => Promise<boolean> | boolean, { interval = 500, timeout = 10000 }: WaitOptions = {}): Promise<boolean> {
  const asyncPredicate = () => Promise.resolve(predicate());

  let elapsed = 0;

  while (!(await asyncPredicate())) {
    if (elapsed > timeout) {
      throw Error('Timeout');
    }

    await sleep(interval);
    elapsed += interval;
  }

  return true;
}

export function sleep (ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
