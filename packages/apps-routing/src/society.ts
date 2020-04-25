// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from './types';

import Society from '@polkadot/app-society';

export default function create (t: (key: string, text: string, options: { ns: string }) => string): Route {
  return {
    Component: Society,
    display: {
      needsApi: [
        'query.society.pot'
      ]
    },
    icon: 'grab',
    name: 'society',
    text: t('nav.society', 'Society', { ns: 'apps-routing' })
  };
}
