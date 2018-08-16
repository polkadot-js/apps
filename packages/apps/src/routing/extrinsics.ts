// Copyright 2017-2018 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Routes } from '../types';

import Extrinsics from '@polkadot/app-extrinsics/index';

export default ([
  {
    Component: Extrinsics,
    i18n: {
      defaultValue: 'Extrinsics'
    },
    icon: 'send',
    isHidden: false,
    name: 'extrinsics'
  }
] as Routes);
