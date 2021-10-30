// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

export function useNamedHook <T> (name: string, fn: (...args: any[]) => T, ...args: unknown[]): T {
  try {
    return fn(...args);
  } catch (error) {
    throw new Error(`${name}:: ${(error as Error).message}:: ${(error as Error).stack || '<unknown>'}`);
  }
}
