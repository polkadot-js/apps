// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useState } from 'react';

import { AccountSidebarCtx } from '@polkadot/react-hooks/ctx/AccountSidebar';

import Sidebar from './Sidebar.js';

interface Props {
  children: React.ReactNode;
}

type State = [string | null, (() => void) | null];

const EMPTY_STATE: State = [null, null];

function AccountSidebar ({ children }: Props): React.ReactElement<Props> {
  const [[address, onUpdateName], setAddress] = useState<State>(EMPTY_STATE);

  const onClose = useCallback(
    () => setAddress([null, null]),
    []
  );

  return (
    <AccountSidebarCtx.Provider value={setAddress}>
      {children}
      {address && (
        <Sidebar
          address={address}
          dataTestId='account-sidebar'
          onClose={onClose}
          onUpdateName={onUpdateName}
        />
      )}
    </AccountSidebarCtx.Provider>
  );
}

export default React.memo(AccountSidebar);
