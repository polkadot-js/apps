// Copyright 2017-2025 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Route, TFunction } from './types.js';

import Component from '@polkadot/app-nfts';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: [
        'tx.uniques.create'
      ]
    },
    group: 'network',
    icon: 'shopping-cart',
    name: 'nfts',
    text: t('nav.nfts', 'NFTs', { ns: 'apps-routing' })
  };
}
