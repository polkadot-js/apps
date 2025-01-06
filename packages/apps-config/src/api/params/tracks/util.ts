// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import { formatBalance } from '@polkadot/util';

interface FormatOptions {
  decimals: number;
  forceUnit: '-',
  withSi: true,
  withUnit: string;
}

export function formatSpendFactory (options: FormatOptions): (mul: number, value: BN) => string {
  return (mul: number, value: BN): string => {
    // We lose the decimals here... depending on chain config, this could be non-optimal
    // (A simple formatBalance(value.muln(mul), FMT_OPTS) formats to 4 decimals)
    return `${formatBalance(value.muln(mul), options).split('.')[0]} ${options.withUnit}`;
  };
}

export function compareFellowshipRank (trackId: number): (rank: BN) => boolean {
  return (rank: BN): boolean =>
    rank.gten(trackId);
}
