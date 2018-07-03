// Copyright 2017-2018 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Routes } from '../types';

import Governance from '@polkadot/app-governance/index';

export default ([
  {
    Component: Governance,
    i18n: {
      defaultValue: 'Governance'
    },
    icon: 'legal',
    isExact: false,
    isHidden: false,
    name: 'governance'
  }
] as Routes);
