// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Route } from './types';

import Component, { useCounter } from '@polkadot/app-settings';

export default function create (t: <T = string> (key: string, text: string, options: { ns: string }) => T): Route {
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
