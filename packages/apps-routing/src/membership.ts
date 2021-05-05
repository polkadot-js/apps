// Copyright 2017-2021 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Route } from './types';

import Component, { useCounter } from '@polkadot/app-membership';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsAccounts: true,
      needsApi: [
        'query.membership.members'
      ]
    },
    group: 'governance',
    icon: 'people-carry',
    name: 'membership',
    text: t('nav.membership', 'Membership', { ns: 'apps-routing' }),
    useCounter
  };
}
