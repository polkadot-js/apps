// Copyright 2017-2025 @polkadot/test-supports authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll, DeriveStakingAccount } from '@polkadot/api-derive/types';
import type { Accounts } from '@polkadot/react-hooks/ctx/types';
import type { UseAccountInfo } from '@polkadot/react-hooks/types';
import type { KeyringJson$Meta } from '@polkadot/ui-keyring/types';

import { BN } from '@polkadot/util';

import { balanceOf } from '../creation/balance.js';
import { makeStakingLedger } from '../creation/staking.js';

export interface Account {
  balance: DeriveBalancesAll,
  info: UseAccountInfo,
  staking: DeriveStakingAccount
}

export type AccountsMap = Record<string, Account>;

export type Override<T> = {
  [P in keyof T]?: T[P];
}

/**
 * Test inputs structure
 */
export interface AccountOverrides {
  meta?: Override<KeyringJson$Meta>;
  balance?: Override<DeriveBalancesAll>;
  staking?: Override<DeriveStakingAccount>;
  info?: Override<UseAccountInfo>;
}

export const emptyAccounts: Accounts = {
  allAccounts: [],
  allAccountsHex: [],
  areAccountsLoaded: true,
  hasAccounts: false,
  isAccount: () => true
};

// here it's extremely hard to reconstruct the entire DeriveBalancesAll upfront, so we incrementally add properties
// instead along the way; thus the need to tell the tsc we know what we are doing here
export const defaultBalanceAccount = {
  accountNonce: new BN(1),
  additional: [],
  availableBalance: balanceOf(0),
  freeBalance: balanceOf(0),
  lockedBalance: balanceOf(0),
  lockedBreakdown: [],
  namedReserves: [],
  reservedBalance: balanceOf(0)
} as unknown as DeriveBalancesAll;

// here it's extremely hard to reconstruct the entire DeriveStakingAccount upfront,
// so we set just the properties that we use in page-accounts
export const defaultStakingAccount = {
  nextSessionIds: [],
  nominators: [],
  redeemable: balanceOf(0),
  sessionIds: [],
  stakingLedger: makeStakingLedger(0),
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
} as unknown as DeriveStakingAccount;

export const defaultMeta: KeyringJson$Meta = {};
export const defaultAccountInfo = {
  flags: {},
  identity: { email: 'user@email.com', isExistent: true, judgements: [] },
  tags: []
} as unknown as UseAccountInfo;

class MockAccountHooks {
  public useAccounts: Accounts = emptyAccounts;
  public accountsMap: AccountsMap = {};

  public nonce: BN = new BN(1);

  public setAccounts (accounts: [string, AccountOverrides][]): void {
    this.useAccounts = {
      allAccounts: accounts.map(([address]) => address),
      allAccountsHex: [],
      areAccountsLoaded: true,
      hasAccounts: accounts && accounts.length !== 0,
      isAccount: () => true
    };

    for (const [address, props] of accounts) {
      const staking = { ...defaultStakingAccount };
      const meta = { ...defaultMeta };
      const balance = { ...defaultBalanceAccount };
      const info = { ...defaultAccountInfo };

      Object
        .entries(props.meta || meta)
        .forEach(([key, value]) => {
          (meta as Record<string, unknown>)[key] = value;
        });
      Object
        .entries(props.balance || balance)
        .forEach(([key, value]) => {
          (balance as Record<string, unknown>)[key] = value;
        });
      Object
        .entries(props.staking || staking)
        .forEach(([key, value]) => {
          (staking as Record<string, unknown>)[key] = value;
        });
      Object
        .entries(props.info || info)
        .forEach(([key, value]) => {
          (info as Record<string, unknown>)[key] = value;
        });

      this.accountsMap[address] = {
        balance,
        info,
        staking
      };
    }
  }
}

export const mockAccountHooks = new MockAccountHooks();
