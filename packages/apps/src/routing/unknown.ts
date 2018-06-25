// Copyright 2017-2018 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Route } from '../types';

import NotFound from '../NotFound';

export default ({
  Component: NotFound,
  i18n: {
    defaultValue: 'Not found'
  },
  icon: 'warning circle',
  isExact: false,
  isHidden: true,
  name: 'unknown'
} as Route);
