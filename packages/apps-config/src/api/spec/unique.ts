// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

import { unique } from '@unique-nft/unique-mainnet-types/definitions';

export default {
  rpc: { unique: unique.rpc }
} as OverrideBundleDefinition;
