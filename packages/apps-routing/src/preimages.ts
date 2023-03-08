// Copyright 2017-2023 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Route } from './types';

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
    text: t<string>('nav.preimages', 'Preimages', { ns: 'apps-routing' })
  };
}
