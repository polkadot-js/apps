// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

export function createNamedHook <F extends (...args: any[]) => any> (name: string, fn: F): (...args: Parameters<F>) => ReturnType<F> {
  return (...args: Parameters<F>): ReturnType<F> => {
    try {
      // eslint-disable-next-line
      return fn(...args);
    } catch (error) {
      throw new Error(`${name}:: ${(error as Error).message}:: ${(error as Error).stack || '<unknown>'}`);
    }
  };
}
