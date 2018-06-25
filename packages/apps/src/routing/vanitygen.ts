// Copyright 2017-2018 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Routes } from '../types';

import Vanity from '@polkadot/app-vanitygen/index';

export default ([
  {
    Component: Vanity,
    i18n: {
      defaultValue: 'Vanity'
    },
    icon: 'hand lizard',
    isExact: false,
    isHidden: false,
    name: 'vanitygen'
  }
] as Routes);
