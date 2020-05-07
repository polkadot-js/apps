// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from './types';

import Template from '@polkadot/app-123code';

export default function create (t: (key: string, text: string, options: { ns: string }) => string): Route {
  return {
    Component: Template,
    display: {
      isHidden: true,
      needsAccounts: true,
      needsApi: [
        'tx.balances.transfer'
      ]
    },
    icon: 'th',
    name: '123code',
    text: t('nav.123-code', 'Template', { ns: 'apps-routing' })
  };
}
