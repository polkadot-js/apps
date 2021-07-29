// Copyright 2017-2021 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll, DeriveStakingAccount } from '@polkadot/api-derive/types';

import BN from 'bn.js';

import { UseAccounts } from '@polkadot/react-hooks/useAccounts';
import { balanceOf } from '@polkadot/test-support/creation/balance';

export interface Account {
  balance: DeriveBalancesAll,
  staking: DeriveStakingAccount
}

export type AccountsMap = { [address: string]: Account };

/**
 * Test inputs structure
 */
export interface AccountOverrides {
  address: string;

  balance?: {
    [P in keyof DeriveBalancesAll]?: DeriveBalancesAll[P];
  };
  staking?: {
    [P in keyof DeriveStakingAccount]?: DeriveStakingAccount[P];
  };
}

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
export const defaultBalanceAccount: DeriveBalancesAll = {
  accountNonce: new BN(1),
  additional: [],
  availableBalance: balanceOf(0),
  freeBalance: balanceOf(0),
  lockedBalance: balanceOf(0),
  lockedBreakdown: [],
  reservedBalance: balanceOf(0)
} as any;

// here it's extremely hard to reconstruct the entire DeriveStakingAccount upfront,
// so we set just the properties that we use in page-accounts
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const defaultStakingAccount: DeriveStakingAccount = {
  nextSessionIds: [],
  nominators: [],
  redeemable: balanceOf(0),
  sessionIds: [],
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  stakingLedger: {
    active: {
      unwrap: () => new BN(0)
    }
  } as any,
  unlocking: [
    {
      remainingEras: new BN('1000000000'),
      value: balanceOf(0)
    },
    {
      remainingEras: new BN('2000000000'),
      value: balanceOf(0)
    },
    {
      remainingEras: new BN('3000000000'),
      value: balanceOf(0)
    }
  ]
} as any;

class MockAccountHooks {
  public useAccounts: UseAccounts = emptyAccounts;
  public accountsMap: AccountsMap = {};

  public nonce: BN = new BN(1);

  public setAccounts (accounts: AccountOverrides[]): void {
    this.useAccounts = {
      allAccounts: accounts.map((account) => account.address),
      allAccountsHex: [],
      areAccountsLoaded: true,
      hasAccounts: accounts && accounts.length !== 0,
      isAccount: () => true
    };

    for (const account of accounts) {
      const staking = { ...defaultStakingAccount };
      const balance = { ...defaultBalanceAccount };

      // Typescript does not recognize that keys and values from Object.entries are safe,
      // so we have to use "any" here.

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      Object.entries(account.balance || balance).forEach(function ([key, value]) { (balance as any)[key] = value; });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      Object.entries(account.staking || staking).forEach(function ([key, value]) { (staking as any)[key] = value; });

      this.accountsMap[account.address] = {
        balance: balance,
        staking: staking
      };
    }
  }
}

export const mockAccountHooks = new MockAccountHooks();
