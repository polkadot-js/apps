// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

import pkg from '@unique-nft/opal-testnet-types/definitions';

const { appPromotion, unique } = pkg;

export default {
  rpc: {
    appPromotion: appPromotion.rpc,
    unique: unique.rpc
  }
} as OverrideBundleDefinition;
