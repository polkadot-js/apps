// Copyright 2017-2021 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Route } from './types';

import Component from '@polkadot/app-crowdloans';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsAccounts: true,
      needsApi: [
        'query.crowdloans'
      ]
    },
    group: 'network',
    icon: 'star',
    name: 'claims',
    text: t('nav.crowdloans', 'Crowdloans', { ns: 'apps-routing' })
  };
}
