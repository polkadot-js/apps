// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TFunction } from 'i18next';
import { Route } from './types';

import { Component, TabsComponent } from '@polkadot/app-extrinsics';

export default function create (t: TFunction): Route {
  return {
    Component,
    TabsComponent,
    display: {
      needsAccounts: true,
      needsApi: []
    },
    group: 'developer',
    icon: 'envelope-open-text',
    name: 'extrinsics',
    text: t('nav.extrinsics', 'Extrinsics', { ns: 'apps-routing' })
  };
}
