// Copyright 2017-2021 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Route } from './types';

import Component from '@polkadot/app-crowdloan';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: [
        'query.crowdloan.funds'
      ]
    },
    group: 'network',
    icon: 'coins',
    name: 'crowdloan',
    text: t('nav.crowdloan', 'Crowdloan', { ns: 'apps-routing' })
  };
}
