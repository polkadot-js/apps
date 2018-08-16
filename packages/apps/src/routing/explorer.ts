// Copyright 2017-2018 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Routes } from '../types';

import Explorer from '@polkadot/app-explorer/index';

export default ([
  {
    Component: Explorer,
    i18n: {
      defaultValue: 'Explorer'
    },
    icon: 'braille',
    isHidden: false,
    name: 'explorer'
  }
] as Routes);
