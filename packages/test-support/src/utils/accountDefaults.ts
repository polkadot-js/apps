// Copyright 2017-2022 @polkadot/test-supports authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll, DeriveStakingAccount } from '@polkadot/api-derive/types';
import type { UseAccountInfo } from '@polkadot/react-hooks/types';

import { UseAccounts } from '@polkadot/react-hooks/useAccounts';
import { KeyringJson$Meta } from '@polkadot/ui-keyring/types';
import { BN } from '@polkadot/util';

import { balanceOf } from '../creation/balance';
import { makeStakingLedger } from '../creation/stakingInfo/stakingLedger';

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
  public useAccounts: UseAccounts = emptyAccounts;
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

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      Object.entries(props.meta || meta).forEach(function ([key, value]) { (meta as any)[key] = value; });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      Object.entries(props.balance || balance).forEach(function ([key, value]) { (balance as any)[key] = value; });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      Object.entries(props.staking || staking).forEach(function ([key, value]) { (staking as any)[key] = value; });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      Object.entries(props.info || info).forEach(function ([key, value]) { (info as any)[key] = value; });

      this.accountsMap[address] = {
        balance: balance,
        info: info,
        staking: staking
      };
    }
  }
}

export const mockAccountHooks = new MockAccountHooks();
