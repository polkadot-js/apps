// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { chainColors, nodeColors, specColors } from './colors';
import { identityNodes, identitySpec } from './identityIcons';
import { sanitize } from './util';

export * from './logos';

export function getSystemIcon (systemName: string, specName: string): 'beachball' | 'polkadot' | 'substrate' {
  return (
    identityNodes[sanitize(systemName)] ||
    identitySpec[sanitize(specName)] ||
    'substrate'
  ) as 'substrate';
}

export function getSystemColor (systemChain: string, systemName: string, specName: string): string | undefined {
  return (
    chainColors[sanitize(systemChain)] ||
    nodeColors[sanitize(systemName)] ||
    specColors[sanitize(specName)]
  );
}
