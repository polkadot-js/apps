// Copyright 2017-2021 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll, DeriveStakingAccount } from '@polkadot/api-derive/types';
import type { Balance } from '@polkadot/types/interfaces';

import BN from 'bn.js';

import { UseAccounts } from '@polkadot/react-hooks/useAccounts';
import { balanceOf } from '@polkadot/test-support/creation/balance';

/**
 * Account input test data
 */
export interface ArrangedAccount {
  address: string,
  freeBalance?: Balance;
  reservedBalance?: Balance;
}

export type BalancesMap = { [address: string]: DeriveBalancesAll[] };

export const emptyAccounts: UseAccounts = {
  allAccounts: [],
  allAccountsHex: [],
  areAccountsLoaded: true,
  hasAccounts: false,
  isAccount: () => true
};

// here it's extremely hard to reconstruct the entire DeriveStakingAccount upfront,
// so we set just the properties that we use in page-accounts
export const someStakingAccount: DeriveStakingAccount = {
  accountId: null as any, // eslint-disable-line no-alert, @typescript-eslint/no-unsafe-assignment
  controllerId: null as any, // eslint-disable-line no-alert, @typescript-eslint/no-unsafe-assignment
  exposure: null as any, // eslint-disable-line no-alert, @typescript-eslint/no-unsafe-assignment
  nextSessionIds: [],
  nominators: [],
  redeemable: balanceOf('300000000'),
  rewardDestination: null as any, // eslint-disable-line no-alert, @typescript-eslint/no-unsafe-assignment
  sessionIds: [],
  stakingLedger: { // eslint-disable-line no-alert, @typescript-eslint/no-unsafe-assignment
    active: {
      unwrap: () => new BN('700000000')
    }
  } as any,
  stashId: null as any, // eslint-disable-line no-alert, @typescript-eslint/no-unsafe-assignment
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
  validatorPrefs: null as any // eslint-disable-line no-alert, @typescript-eslint/no-unsafe-assignment
};

class MockAccountHooks {
  public useAccounts: UseAccounts = emptyAccounts;
  public accountInfo: DeriveStakingAccount = someStakingAccount;
  public accountsBalancesMap: BalancesMap = {};

  public nonce: BN = new BN(1);

  public setAccounts (accounts: ArrangedAccount[]): void {
    this.useAccounts = {
      allAccounts: accounts.map((account) => account.address),
      allAccountsHex: [],
      areAccountsLoaded: true,
      hasAccounts: accounts && accounts.length !== 0,
      isAccount: () => true
    };

    for (let accountIdx = 0; accountIdx < accounts.length; accountIdx++) {
      const account = accounts[accountIdx];

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.accountsBalancesMap[account.address] = {
        accountNonce: new BN(1),
        additional: [],
        freeBalance: account.freeBalance || balanceOf(0),
        lockedBreakdown: [],
        reservedBalance: account.reservedBalance || balanceOf(0)
      } as any;
    }
  }
}

export const mockAccountHooks = new MockAccountHooks();
