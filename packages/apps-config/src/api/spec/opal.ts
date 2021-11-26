// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

export default {
  rpc: { unique: require('@unique-nft/types/definitions').unique.rpc },
} as OverrideBundleDefinition;
