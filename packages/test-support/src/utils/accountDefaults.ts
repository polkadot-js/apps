// Copyright 2017-2023 @polkadot/test-supports authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll, DeriveStakingAccount } from '@polkadot/api-derive/types';
import type { Accounts } from '@polkadot/react-hooks/ctx/types';
import type { UseAccountInfo } from '@polkadot/react-hooks/types';
import type { KeyringJson$Meta } from '@polkadot/ui-keyring/types';

import { BN } from '@polkadot/util';

import { balanceOf } from '../creation/balance.js';
import { makeStakingLedger } from '../creation/stakingInfo/stakingLedger.js';

export interface Account {
  balance: DeriveBalancesAll,
  info: UseAccountInfo,
  staking: DeriveStakingAccount
}

export type AccountsMap = { [address: string]: Account };

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
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const defaultBalanceAccount: DeriveBalancesAll = {
  accountNonce: new BN(1),
  additional: [],
  availableBalance: balanceOf(0),
  freeBalance: balanceOf(0),
  lockedBalance: balanceOf(0),
  lockedBreakdown: [],
  namedReserves: [],
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
} as any;

export const defaultMeta: KeyringJson$Meta = {};
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const defaultAccountInfo: UseAccountInfo = {
  flags: {},
  identity: { email: 'user@email.com', isExistent: true, judgements: [] },
  tags: []
} as any;

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

      // Typescript does not recognize that keys and values from Object.entries are safe,
      // so we have to use "any" here.

      Object
        .entries(props.meta || meta)
        .forEach(([key, value]) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          (meta as any)[key] = value;
        });
      Object
        .entries(props.balance || balance)
        .forEach(([key, value]) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          (balance as any)[key] = value;
        });
      Object
        .entries(props.staking || staking)
        .forEach(([key, value]) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          (staking as any)[key] = value;
        });
      Object
        .entries(props.info || info)
        .forEach(([key, value]) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          (info)[key] = value;
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
