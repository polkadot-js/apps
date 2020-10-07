// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Environment } from '../types';

// https://github.com/electron/electron/issues/2288
function isElectron () {
  if (process?.versions?.electron) {
    return true;
  }

  if (window?.process?.type === 'renderer') {
    return true;
  }

  return navigator?.userAgent?.indexOf('Electron') >= 0;
}

export default function getEnvironment (): Environment {
  if (isElectron()) {
    return 'app';
  }

  return 'web';
}
