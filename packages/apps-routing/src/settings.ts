// Copyright 2017-2020 @canvas-ui/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Route } from './types';

import Settings from '@canvas-ui/app-settings';

export default function create (t: <T = string> (key: string, text: string, options: { ns: string }) => T): Route {
  return {
    Component: Settings,
    display: {},
    isIgnored: true,
    name: 'settings',
    text: t<string>('nav.settings', 'Settings', { ns: 'apps-routing' })
  };
}
