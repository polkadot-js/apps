// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from './types';

import Explorer from '@polkadot/app-explorer';

export default function create (t: (key: string, text: string, options: { ns: string }) => string): Route {
  return {
    Component: Explorer,
    display: {
      needsApi: []
    },
    icon: 'braille',
    name: 'explorer',
    text: t('nav.explorer', 'Explorer', { ns: 'apps-routing' })
  };
}
