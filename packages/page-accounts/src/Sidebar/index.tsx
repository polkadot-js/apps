// Copyright 2017-2023 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useState } from 'react';

import Sidebar from './Sidebar';

interface Props {
  children: React.ReactNode;
}

type State = [string | null, (() => void) | null];

type SetStateContext = undefined | (([address, onUpdateName]: State) => void);

const EMPTY_STATE: State = [null, null];

export const AccountSidebarCtx = React.createContext<SetStateContext>(undefined);

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
