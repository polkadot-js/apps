// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';

import Component, { useCounter } from '@polkadot/app-settings';

import type { Route } from './types';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {},
    group: 'settings',
    icon: 'cogs',
    name: 'settings',
    text: t('nav.settings', 'Settings', { ns: 'apps-routing' }),
    useCounter
  };
}
