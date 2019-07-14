// Copyright 2017-2019 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from './types';

import Collective from '@polkadot/app-collective';

export default ([
  {
    Component: Collective,
    display: {
      needsApi: [
        'query.elections.candidates'
      ]
    },
    i18n: {
      defaultValue: 'Collective'
    },
    icon: 'building',
    name: 'collective'
  }
] as Routes);
