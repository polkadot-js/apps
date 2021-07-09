// Copyright 2017-2021 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Balance } from '@polkadot/types/interfaces';

import BN from 'bn.js';

import { UseAccounts } from '@polkadot/react-hooks/useAccounts';
import { balanceOf } from '@polkadot/test-support/creation/balance';

export const emptyAccounts: UseAccounts = {
  allAccounts: [],
  allAccountsHex: [],
  areAccountsLoaded: true,
  hasAccounts: false,
  isAccount: () => true
};

export class AccountHooks {
  public useAccounts: UseAccounts = emptyAccounts;

  public nonce: BN = new BN(1);

  public balanceOf (balance: number): Balance {
    return balanceOf(balance);
  }

  public setAccounts (accounts: string[]): void {
    this.useAccounts = {
      allAccounts: accounts,
      allAccountsHex: [],
      areAccountsLoaded: true,
      hasAccounts: accounts && accounts.length !== 0,
      isAccount: () => true
    };
  }
}

export const mockAccountHooks = new AccountHooks();
