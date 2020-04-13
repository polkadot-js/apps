// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useCallback, useState } from 'react';

import Sidebar from './Sidebar';

type ToggleContext = undefined | ((address: string) => void);

interface Props {
  children: React.ReactNode;
}

const AccountSidebarToggle: React.Context<ToggleContext> = React.createContext<ToggleContext>(undefined);

function AccountSidebar ({ children }: Props): React.ReactElement<Props> {
  const [address, setAddress] = useState<string | null>(null);

  const closeSidebar = useCallback(
    () => setAddress(null),
    []
  );

  return (
    <AccountSidebarToggle.Provider value={setAddress}>
      {children}
      {address && (
        <Sidebar
          address={address}
          closeSidebar={closeSidebar}
        />
      )}
    </AccountSidebarToggle.Provider>
  );
}

export { AccountSidebarToggle };

export default React.memo(AccountSidebar);
