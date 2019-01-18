// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from '../types';

import Status from '@polkadot/app-status/index';

export default ([
  {
    Component: Status,
    i18n: {
      defaultValue: 'Status'
    },
    icon: 'tty',
    isApiGated: true,
    isHidden: false,
    name: 'status'
  }
] as Routes);
