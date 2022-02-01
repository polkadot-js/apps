// Copyright 2017-2022 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

export function increaseDateByBlocks (blocks: BN, blockTime: number): Date {
  return new Date(Date.now() + blocks.muln(blockTime).toNumber());
}
