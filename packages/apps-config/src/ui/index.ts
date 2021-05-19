// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { chainColors, nodeColors, specColors } from './colors';
import { identityNodes } from './identityIcons';

export * from './logos';

function sanitize (value?: string): string {
  return value?.toLowerCase().replace('-', ' ') || '';
}

export function getSystemIcon (systemName: string): 'beachball' | 'polkadot' | 'substrate' {
  return (identityNodes[systemName.toLowerCase().replace(/-/g, ' ')] || 'substrate') as 'substrate';
}

export function getSystemColor (systemChain: string, systemName: string, specName: string): string | undefined {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return chainColors[sanitize(systemChain)] || nodeColors[sanitize(systemName)] || specColors[sanitize(specName)];
}
