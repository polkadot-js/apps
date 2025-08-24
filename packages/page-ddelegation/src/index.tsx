// Copyright 2017-2023 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppProps as Props } from '@polkadot/react-components/types';

import React, { useRef } from 'react';
import { Route } from 'react-router';

import { HelpOverlay, Tabs } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

// import basicMd from './md/basic.md';
import DelegateModal from './modals/Delegate';
import Accounts from './Accounts';
import { useTranslation } from './translate';
import useCounter from './useCounter';

export { useCounter };

function AccountsApp ({ basePath, onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isDelegateOpen, toggleDelegate] = useToggle();

  const tabsRef = useRef([
    {
      isRoot: true,
      name: 'overview',
      text: t<string>('Delegation')
    }
  ]);

  return (
    <main className='accounts--App'>
      {/* <HelpOverlay md={basicMd as string} /> */}
      <Tabs
        basePath={basePath}
        items={tabsRef.current}
      />
      <DelegateModal
        onClose={toggleDelegate}
      />
      <Route>
        <Accounts
          basePath={basePath}
          onStatusChange={onStatusChange}
        />
      </Route>
    </main>
  );
}

export default React.memo(AccountsApp);
