// Copyright 2017-2025 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { MetadataDef } from '@polkadot/extension-inject/types';

export type ChainType = 'substrate' | 'ethereum';

export interface ChainInfo extends MetadataDef {
  color: string | undefined;
  chainType: ChainType;
}
