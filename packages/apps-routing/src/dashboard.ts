// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Route } from './types';

import Component from '@polkadot/app-dashboard';

export default function create (t: <T = string> (key: string, text: string, options: { ns: string }) => T): Route {
  return {
    Component,
    display: {
      isHidden: true
    },
    group: 'network',
    icon: 'th',
    name: 'dashboard',
    text: t<string>('nav.dashboard', 'Dashboard', { ns: 'apps-routing' })
  };
}
