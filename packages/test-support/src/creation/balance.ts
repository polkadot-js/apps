// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Balance } from '@polkadot/types/interfaces';

import BN from 'bn.js';

import { TypeRegistry } from '@polkadot/types/create';

export function balanceOf (number: number | string): Balance {
  return new TypeRegistry().createType('Balance', new BN(number));
}
