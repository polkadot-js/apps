// Copyright 2017-2018 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Routes } from '../types';

import Democracy from '@polkadot/app-democracy/index';

export default ([
  {
    Component: Democracy,
    i18n: {
      defaultValue: 'Democracy'
    },
    icon: 'calendar check',
    isHidden: false,
    name: 'democracy'
  }
] as Routes);
