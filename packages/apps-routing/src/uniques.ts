// Copyright 2017-2022 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Route } from './types';

import Component from '@polkadot/app-uniques';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: [
        'tx.uniques.setMetadata',
        // 'tx.assets.transferKeepAlive'
      ]
    },
    group: 'network',
    icon: 'shopping-basket',
    name: 'uniques',
    text: t('nav.uniques', 'Uniques', { ns: 'apps-routing' })
  };
}
