// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from './types';

import Template from '@polkadot/app-123code';

const route: Route = {
  Component: Template,
  display: {
    isHidden: true,
    needsAccounts: true,
    needsApi: [
      'tx.balances.transfer'
    ]
  },
  i18n: {
    defaultValue: 'Template'
  },
  icon: 'th',
  name: '123code'
};

export default route;
