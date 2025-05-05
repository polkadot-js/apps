// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

export interface LinkPath {
  // general
  address?: string;
  block?: string;
  extrinsic?: string;
  validator?: string;

  // governance 1
  bounty?: string;
  council?: string;
  democracyExternal?: string;
  democracyProposal?: string;
  democracyReferendum?: string;
  techcomm?: string;
  tip?: string;
  treasury?: string;

  // governance 2
  fellowshipReferenda?: string;
  ambassadorReferenda?: string;
  rankedPolls?: string;
  referenda?: string;
}

export type LinkTypes = keyof LinkPath;

export interface ExternalDef {
  chains: Record<string, string>;
  homepage: string;
  isActive: boolean;
  paths: LinkPath;
  ui: { logo: string; }

  create: (chain: string, path: string, data: BN | number | string, hash?: string) => string;
}
