// Copyright 2017-2025 @polkadot/test-supports authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Registry } from '@polkadot/types/types';

import { TypeRegistry, u128 as U128 } from '@polkadot/types';

export function balanceOf (number: number | string): U128 {
  // FIXME - ref: https://github.com/polkadot-js/apps/pull/11051
  // Adding support for CJS and ESM correctly has caused some build issues.
  // This is a hacky type cast to allow the compiler to be happy.
  return new U128(new TypeRegistry() as unknown as Registry, number);
}
