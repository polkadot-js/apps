// Copyright 2017-2021 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';

export function increaseDateByBlocks (blocks: BN, blockTime: number): Date {
  return new Date(Date.now() + blocks.muln(blockTime).toNumber());
}
