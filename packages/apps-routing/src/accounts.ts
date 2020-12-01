// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';

import Component, { useCounter } from '@polkadot/app-accounts';

import type { Route } from './types';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: []
    },
    group: 'accounts',
    icon: 'users',
    name: 'accounts',
    text: t('nav.accounts', 'Accounts', { ns: 'apps-routing' }),
    useCounter
  };
}
