// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ChainSpecName, FeeAsset } from './types';

// A mapping of chains to their fee asset if different to the native token
export const feeAssets: Record<ChainSpecName, FeeAsset> = {
  root: {
    assetId: 2,
    decimals: 6,
    symbol: 'XRP'
  }
};
