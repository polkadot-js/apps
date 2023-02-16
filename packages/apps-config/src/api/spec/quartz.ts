// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

import { unique, appPromotion } from '@unique-nft/quartz-mainnet-types/definitions';

export default {
  rpc: { 
    unique: unique.rpc, 
    appPromotion: appPromotion.rpc
  }
} as OverrideBundleDefinition;
