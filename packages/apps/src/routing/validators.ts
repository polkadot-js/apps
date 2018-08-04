// Copyright 2017-2018 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Routes } from '../types';

import Validators from '@polkadot/app-validators/index';

export default ([
  {
    Component: Validators,
    i18n: {
      defaultValue: 'Validators'
    },
    icon: 'bullhorn',
    isExact: false,
    isHidden: false,
    name: 'validators'
  }
] as Routes);
