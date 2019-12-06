// Copyright 2017-2019 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from './types';

import ChangeOperator from '@polkadot/app-accounts/modals/ChangeOperator';

export default ([
  {
    Modal: ChangeOperator,
    display: {
      isHidden: false,
      needsAccounts: true,
      needsApi: [
        'tx.operator.changeOperator'
      ]
    },
    i18n: {
      defaultValue: 'Operator'
    },
    icon: 'th',
    name: 'operator'
  }
] as Routes);
