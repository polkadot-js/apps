// Copyright 2017-2021 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll } from '@polkadot/api-derive/types';

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

// here it's extremely hard to reconstruct the entire DeriveBalancesAll upfront, so we incrementally add properties
// instead along the way; thus the need to tell the tsc we know what we are doing here
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const someBalances: DeriveBalancesAll = {
  accountNonce: new BN(1),
  additional: [],
  freeBalance: balanceOf('1000000000000'),
  lockedBreakdown: [],
  reservedBalance: balanceOf('50000000000')
} as any;

class MockAccountHooks {
  public useAccounts: UseAccounts = emptyAccounts;

  public accountBalances: DeriveBalancesAll = someBalances;

  public nonce: BN = new BN(1);

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

export const mockAccountHooks = new MockAccountHooks();
