// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

export type LinkTypes = 'address' | 'block' | 'bounty' | 'council' | 'extrinsic' | 'proposal' | 'referendum' | 'techcomm' | 'tip' | 'treasury';

export interface ExternalDef {
  chains: Record<string, string>;
  isActive: boolean;
  logo: string;
  paths: Partial<Record<LinkTypes, string>>;
  url: string;
  create: (chain: string, path: string, data: BN | number | string, hash?: string) => string;
}
