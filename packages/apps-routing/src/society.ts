// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from './types';

import Society, { useCheck } from '@polkadot/app-society';

export default ([
  {
    Component: Society,
    useCheck,
    display: {
      needsApi: [
        'query.society.pot'
      ]
    },
    i18n: {
      defaultValue: 'Society'
    },
    icon: 'grab',
    name: 'society'
  }
] as Routes);
