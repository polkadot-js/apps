// Copyright 2017-2018 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Routes } from '../types';

import Toolbox from '@polkadot/app-toolbox/index';

export default ([
  {
    Component: Toolbox,
    i18n: {
      defaultValue: 'Toolbox'
    },
    icon: 'configure',
    isHidden: false,
    name: 'toolbox'
  }
] as Routes);
