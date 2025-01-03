// Copyright 2017-2025 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Route, TFunction } from './types.js';

import Component, { useCounter } from '@polkadot/app-claims';
import { hasBuffer, u8aToBuffer } from '@polkadot/util';

// See https://github.com/polkadot-js/apps/issues/10115 - this may not work,
// if not we will have to disable it all (no way of testing)
function needsApiCheck (): boolean {
  try {
    if (!Buffer.from([1, 2, 3])?.length) {
      console.error('ERROR: Unable to construct Buffer object for claims module');

      return false;
    } else if (!hasBuffer || !Buffer.isBuffer(u8aToBuffer(new Uint8Array([1, 2, 3])))) {
      console.error('ERROR: Unable to use u8aToBuffer for claims module');

      return false;
    }
  } catch {
    console.error('ERROR: Fatal error in working with Buffer module');

    return false;
  }

  return true;
}

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsAccounts: true,
      needsApi: [
        'tx.claims.mintClaim'
      ],
      needsApiCheck
    },
    group: 'accounts',
    icon: 'star',
    name: 'claims',
    text: t('nav.claims', 'Claim Tokens', { ns: 'apps-routing' }),
    useCounter
  };
}
