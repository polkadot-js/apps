// Copyright 2017-2021 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll, DeriveStakingAccount } from '@polkadot/api-derive/types';

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
  availableBalance: balanceOf('700000000000'),
  freeBalance: balanceOf('1000000000000'),
  lockedBalance: balanceOf('300000000000'),
  lockedBreakdown: [],
  reservedBalance: balanceOf('50000000000')
} as any;

// here it's extremely hard to reconstruct the entire DeriveStakingAccount upfront, so we incrementally add properties
// instead along the way; thus the need to tell the tsc we know what we are doing here
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const someStakingAccount: DeriveStakingAccount = {
  accountId: null as any,
  stakingLedger: {
    active: {
      unwrap: () => new BN('700000000')
    }
  } as any,
  controllerId: null as any,
  exposure: null as any,
  nominators: [],
  rewardDestination: null as any,
  stashId: null as any,
  validatorPrefs: null as any,
  nextSessionIds: [],
  sessionIds: [],
  unlocking: [
    {
      remainingEras: new BN('1000000000'),
      value: balanceOf('1000000000')
    },
    {
      remainingEras: new BN('2000000000'),
      value: balanceOf('2000000000')
    },
    {
      remainingEras: new BN('3000000000'),
      value: balanceOf('3000000000')
    }
  ],
  redeemable: balanceOf('300000000')
};

class MockAccountHooks {
  public useAccounts: UseAccounts = emptyAccounts;

  public accountBalances: DeriveBalancesAll = someBalances;
  public accountInfo: DeriveStakingAccount = someStakingAccount;

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
