// Copyright 2017-2021 @polkadot/test-support authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Hash } from '@polkadot/types/interfaces';

import { POLKADOT_GENESIS } from '@polkadot/apps-config';
import { TypeRegistry } from '@polkadot/types/create';

export function aGenesisHash (): Hash {
  return new TypeRegistry().createType('Hash', POLKADOT_GENESIS);
}

export function aHash (): Hash {
  return new TypeRegistry().createType('Hash');
}
