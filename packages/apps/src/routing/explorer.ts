// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from '../types';

import Explorer from '@polkadot/app-explorer/index';

export default ([
  {
    Component: Explorer,
    i18n: {
      defaultValue: 'Explorer'
    },
    icon: 'braille',
    isApiGated: true,
    isHidden: false,
    name: 'explorer'
  }
] as Routes);
