// Copyright 2017-2018 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Routes } from '../types';

import Staking from '@polkadot/app-staking/index';

export default ([
  {
    Component: Staking,
    i18n: {
      defaultValue: 'Staking'
    },
    icon: 'certificate',
    isHidden: false,
    name: 'staking'
  }
] as Routes);
