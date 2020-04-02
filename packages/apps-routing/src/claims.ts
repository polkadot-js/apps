// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from './types';

import Claims from '@polkadot/app-claims';

const route: Route = {
  Component: Claims,
  display: {
    needsApi: [
      'query.claims.claims'
    ]
  },
  i18n: {
    defaultValue: 'Claim Tokens'
  },
  icon: 'star',
  name: 'claims'
};

export default route;
