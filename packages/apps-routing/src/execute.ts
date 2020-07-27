// Copyright 2017-2020 @canvas-ui/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from './types';

import Component from '@canvas-ui/app-execute';

export default function create (t: <T = string> (key: string, text: string, options: { ns: string }) => T): Route {
  return {
    Component,
    display: {
      needsAccounts: true,
      needsApi: []
    },
    name: 'execute',
    text: t<string>('nav.execute', 'Execute', { ns: 'apps-routing' })
  };
}
