// Copyright 2017-2022 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useState } from 'react';

import Sidebar from './Sidebar';

interface Props {
  children: React.ReactNode;
}

type State = [string | null, (() => void) | null];

type ToggleContext = undefined | (([address, onUpdateName]: State) => void);

const AccountSidebarToggle: React.Context<ToggleContext> = React.createContext<ToggleContext>(undefined);

function AccountSidebar ({ children }: Props): React.ReactElement<Props> {
  const [[address, onUpdateName], setAddress] = useState<State>([null, null]);

  const onClose = useCallback(
    () => setAddress([null, null]),
    []
  );

  return (
    <AccountSidebarToggle.Provider value={setAddress}>
      {children}
      {address && (
        <Sidebar
          address={address}
          dataTestId='account-sidebar'
          onClose={onClose}
          onUpdateName={onUpdateName}
        />
      )}
    </AccountSidebarToggle.Provider>
  );
}

export { AccountSidebarToggle };

export default React.memo(AccountSidebar);
