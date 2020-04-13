// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useContext } from 'react';

import { AccountSidebarToggle } from '@polkadot/app-accounts/Sidebar';

type ToggleContext = undefined | ((address: string) => void);

export default function useAccountSidebar (): ToggleContext {
  return useContext(AccountSidebarToggle);
}
