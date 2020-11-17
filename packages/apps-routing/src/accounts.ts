// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TFunction } from 'i18next';
import { Route } from './types';

import { useCounter, Component, TabsComponent, helpText } from '@polkadot/app-accounts';

export default function create (t: TFunction): Route {
  return {
    Component,
    TabsComponent,
    display: {
      needsApi: []
    },
    group: 'accounts',
    helpText,
    icon: 'users',
    name: 'accounts',
    text: t('nav.accounts', 'Accounts', { ns: 'apps-routing' }),
    useCounter
  };
}
