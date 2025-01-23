// Copyright 2017-2025 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Route, TFunction } from './types.js';

import Component from '@polkadot/app-preimages';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsAccounts: true,
      needsApi: [
        'query.preimage.statusFor',
        'tx.preimage.notePreimage'
      ]
    },
    group: 'governance',
    icon: 'panorama',
    name: 'preimages',
    text: t('nav.preimages', 'Preimages', { ns: 'apps-routing' })
  };
}
