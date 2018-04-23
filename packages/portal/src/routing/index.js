// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Routing } from '../types';

// import accounts from './accounts';
import explorer from './explorer';
import extrinsics from './extrinsics';
// import home from './home';
// import settings from './settings';

export default ({
  default: 'explorer',
  routes: [].concat(
    explorer, extrinsics
  )
}: Routing);
