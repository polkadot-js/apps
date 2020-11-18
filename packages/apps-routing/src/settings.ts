// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TFunction } from 'i18next';
import { Route } from './types';

import { Component, TabsComponent, helpText, useCounter } from '@polkadot/app-settings';

export default function create (t: TFunction): Route {
  return {
    Component,
    TabsComponent,
    display: {},
    group: 'settings',
    helpText,
    icon: 'cogs',
    name: 'settings',
    text: t('nav.settings', 'Settings', { ns: 'apps-routing' }),
    useCounter
  };
}
