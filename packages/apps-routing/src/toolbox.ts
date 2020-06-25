// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from './types';

import Toolbox from '@polkadot/app-toolbox';

export default function create (t: <T = string> (key: string, text: string, options: { ns: string }) => T): Route {
  return {
    Component: Toolbox,
    display: {
      needsApi: []
    },
    icon: 'tools',
    name: 'toolbox',
    text: t<string>('nav.toolbox', 'Toolbox', { ns: 'apps-routing' })
  };
}
