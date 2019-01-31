// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from '../types';

import Toolbox from '@polkadot/app-toolbox/index';

export default ([
  {
    Component: Toolbox,
    display: {
      needsApi: []
    },
    i18n: {
      defaultValue: 'Toolbox'
    },
    icon: 'configure',
    name: 'toolbox'
  }
] as Routes);
