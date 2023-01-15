// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

export interface LinkPath {
  address?: string;
  block?: string;
  bounty?: string;
  council?: string;
  democracyExternal?: string;
  democracyProposal?: string;
  democracyReferendum?: string;
  extrinsic?: string;
  fellowshipReferenda?: string;
  referenda?: string;
  techcomm?: string;
  tip?: string;
  treasury?: string;
  validator?: string;
}

export type LinkTypes = keyof LinkPath;

export interface ExternalDef {
  chains: Record<string, string>;
  isActive: boolean;
  logo: string;
  paths: LinkPath;
  url: string;
  create: (chain: string, path: string, data: BN | number | string, hash?: string) => string;
}
