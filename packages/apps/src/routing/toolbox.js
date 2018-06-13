// Copyright 2017-2018 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Routes } from '../types';

import Toolbox from '@polkadot/app-toolbox';

export default ([
  {
    Component: Toolbox,
    i18n: {
      defaultValue: 'Toolbox'
    },
    icon: 'configure',
    isExact: false,
    isHidden: false,
    name: 'toolbox'
  }
]: Routes);
