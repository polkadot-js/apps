// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Route } from '../types';

import NotFound from '../NotFound';

export default ({
  Component: NotFound,
  i18n: {
    defaultValue: 'Not found'
  },
  icon: 'error',
  isExact: false,
  isHidden: true,
  name: 'unknown'
}: Route);
