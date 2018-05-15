// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Routes } from '../types';

import Vanity from '@polkadot/app-vanitygen/src';

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
]: Routes);
