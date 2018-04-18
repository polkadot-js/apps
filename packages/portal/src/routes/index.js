// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Routes } from '../types';

// import accounts from './accounts';
import home from './home';
// import settings from './settings';
import testing from './testing';

export default (([].concat(
  home, testing
  // , accounts, settings
)): Routes);
