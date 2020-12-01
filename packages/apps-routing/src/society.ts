// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';

import Component, { useCounter } from '@polkadot/app-society';

import type { Route } from './types';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsAccounts: true,
      needsApi: [
        'query.society.pot'
      ]
    },
    group: 'network',
    icon: 'hand-spock',
    name: 'society',
    text: t('nav.society', 'Society', { ns: 'apps-routing' }),
    useCounter
  };
}
