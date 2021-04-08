// Copyright 2017-2021 @polkadot/app-routing authors & contributors
// and @canvas-ui/app-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import Component from '@canvas-ui/app-instantiate';

import { Route } from './types';

export default function create (t: <T = string> (key: string, text: string, options: { ns: string }) => T): Route {
  return {
    Component,
    display: {
      needsAccounts: true,
      needsApi: [],
      needsCodes: true
    },
    name: 'instantiate',
    text: t<string>('nav.instantiate', 'Instantiate', { ns: 'app-routing' })
  };
}
