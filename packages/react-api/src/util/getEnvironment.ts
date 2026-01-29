// Copyright 2017-2025 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Environment } from '../types.js';

// https://github.com/electron/electron/issues/2288
function isElectron () {
  if (process?.versions?.electron) {
    return true;
  } else if ((window?.process as unknown as (Record<string, string> | undefined))?.type === 'renderer') {
    return true;
  }

  return navigator?.userAgent?.indexOf('Electron') >= 0;
}

export function getEnvironment (): Environment {
  if (isElectron()) {
    return 'app';
  }

  return 'web';
}
