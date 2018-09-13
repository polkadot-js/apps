// Copyright 2017-2018 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Routes } from '../types';

import Example from '@polkadot/app-example/index';

export default ([
  {
    Component: Example,
    i18n: {
      defaultValue: 'Example'
    },
    icon: 'hand spock',
    isHidden: true,
    name: 'example'
  }
] as Routes);
