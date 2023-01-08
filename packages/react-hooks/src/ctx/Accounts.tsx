// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import type { Accounts } from './types';

import React, { useEffect, useState } from 'react';

import { keyring } from '@polkadot/ui-keyring';
import { u8aToHex } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';

interface Props {
  children?: React.ReactNode;
}

const EMPTY: Accounts = { allAccounts: [], allAccountsHex: [], areAccountsLoaded: false, hasAccounts: false, isAccount: () => false };

export const AccountsContext = React.createContext<Accounts>(EMPTY);

function extractAccounts (accounts: SubjectInfo = {}): Accounts {
  const allAccounts = Object.keys(accounts);
  const allAccountsHex = allAccounts.map((a) => u8aToHex(decodeAddress(a)));
  const hasAccounts = allAccounts.length !== 0;
  const isAccount = (address?: string | null) => !!address && allAccounts.includes(address);

  return { allAccounts, allAccountsHex, areAccountsLoaded: true, hasAccounts, isAccount };
}

export function AccountsCtxRoot ({ children }: Props): React.ReactElement<Props> {
  const [accounts, setAccounts] = useState<Accounts>(EMPTY);

  // No unsub, global context - destroyed on app close
  useEffect((): void => {
    keyring.accounts.subject.subscribe((accounts) =>
      setAccounts(extractAccounts(accounts))
    );
  }, []);

  return (
    <AccountsContext.Provider value={accounts}>
      {children}
    </AccountsContext.Provider>
  );
}
