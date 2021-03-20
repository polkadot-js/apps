// Copyright 2017-2021 @polkadot/test-support authors & contributors
// SPDX-License-Identifier: Apache-2.0

export type WaitOptions = { interval?: number, timeout?: number };

export async function waitFor (predicate: () => boolean, { interval, timeout }: WaitOptions): Promise<boolean>;
export async function waitFor (predicate: () => Promise<boolean>, { interval, timeout }: WaitOptions): Promise<boolean>;

export async function waitFor (predicate: () => Promise<boolean> | boolean, { interval = 500, timeout = 10000 } = {}): Promise<boolean> {
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

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
