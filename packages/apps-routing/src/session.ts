// Copyright 2017-2019 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from './types';

import SessionKeyModal from '@polkadot/app-accounts/modals/SessionKey';

export default ([
  {
    Modal: SessionKeyModal,
    display: {
      isHidden: false,
      needsAccounts: true,
      needsApi: [
        'tx.session.setKeys' // current set_keys API
      ]
    },
    i18n: {
      defaultValue: 'Session Key'
    },
    icon: 'certificate',
    name: 'session'
  }
] as Routes);
