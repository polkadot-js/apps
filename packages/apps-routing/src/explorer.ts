// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Route } from './types';

import Component from '@polkadot/app-explorer';

export default function create (t: <T = string> (key: string, text: string, options: { ns: string }) => T): Route {
  return {
    Component,
    display: {
      needsApi: []
    },
    group: 'network',
    icon: 'braille',
    name: 'explorer',
    text: t<string>('nav.explorer', 'Explorer', { ns: 'apps-routing' })
  };
}
