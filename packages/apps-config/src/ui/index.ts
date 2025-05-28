// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { packageInfo } from '../packageInfo.js';
import { identityNodes, identitySpec } from './identityIcons/index.js';
import { sanitize } from './util.js';

export function getSystemIcon (systemName: string, specName: string): 'beachball' | 'polkadot' | 'substrate' {
  return (
    identityNodes[sanitize(systemName)] ||
    identitySpec[sanitize(specName)] ||
    'substrate'
  ) as 'substrate';
}

export function getPackageVersion () {
  return `apps v${packageInfo.version.replace('-x', '')}`;
}
