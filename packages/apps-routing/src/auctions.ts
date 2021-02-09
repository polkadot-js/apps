// Copyright 2017-2021 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Route } from './types';

import Component from '@polkadot/app-auctions';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: [
        'query.auctions.auctionCounter'
      ]
    },
    group: 'network',
    icon: 'gavel',
    name: 'auctions',
    text: t('nav.auctions', 'Auctions', { ns: 'apps-routing' })
  };
}
