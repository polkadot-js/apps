// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

import pkg from '@unique-nft/sapphire-mainnet-types/definitions.js';

export default {
  rpc: {
    appPromotion: pkg.appPromotion.rpc,
    unique: pkg.unique.rpc
  }
} as OverrideBundleDefinition;
