// Copyright 2017-2021 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll } from '@polkadot/api-derive/types';

import BN from 'bn.js';

import { UseAccounts } from '@polkadot/react-hooks/useAccounts';
import { balanceOf } from '@polkadot/test-support/creation/balance';

/**
 * Account input test data
 */
export interface ArrangedAccount {
  _id: string,
  freeBalance?: number;
  reservedBalance?: number;
}

export type BalancesMap = { [address: string]: DeriveBalancesAll[] };

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
  reservedBalance: balanceOf(0)
} as any;

class MockAccountHooks {
  public useAccounts: UseAccounts = emptyAccounts;

  public accountsBalancesMap: BalancesMap = {};

  public nonce: BN = new BN(1);

  public setAccounts (accounts: ArrangedAccount[]): void {
    this.useAccounts = {
      allAccounts: accounts.map((account) => account._id),
      allAccountsHex: [],
      areAccountsLoaded: true,
      hasAccounts: accounts && accounts.length !== 0,
      isAccount: () => true
    };

    for (let accountIdx = 0; accountIdx < accounts.length; accountIdx++) {
      const account = accounts[accountIdx];

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.accountsBalancesMap[account._id] = {
        accountNonce: new BN(1),
        additional: [],
        freeBalance: balanceOf(account.freeBalance || 0),
        lockedBreakdown: [],
        reservedBalance: balanceOf(account.reservedBalance || 0)
      } as any;
    }
  }
}

export const mockAccountHooks = new MockAccountHooks();
