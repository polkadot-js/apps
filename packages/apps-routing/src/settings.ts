// Copyright 2017-2023 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Route } from './types.js';

import Component, { useCounter } from '@polkadot/app-settings';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {},
    group: 'settings',
    icon: 'cogs',
    name: 'settings',
    text: t<string>('nav.settings', 'Settings', { ns: 'apps-routing' }),
    useCounter
  };
}
