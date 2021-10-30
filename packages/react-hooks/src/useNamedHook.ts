// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

export function useNamedHook <T, F extends (...args: any[]) => T> (name: string, fn: F, ...args: Parameters<F>): T {
  try {
    return fn(...args);
  } catch (error) {
    throw new Error(`${name}:: ${(error as Error).message}:: ${(error as Error).stack || '<unknown>'}`);
  }
}
