// Copyright 2017-2021 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Balance } from '@polkadot/types/interfaces';

import { fireEvent, screen, within } from '@testing-library/react';
import BN from 'bn.js';

import { DeriveBalancesAll, DeriveStakingAccount } from '@polkadot/api-derive/types';
import i18next from '@polkadot/react-components/i18n';
import toShortAddress from '@polkadot/react-components/util/toShortAddress';
import { UseAccountInfo } from '@polkadot/react-hooks/types';
import { balanceOf } from '@polkadot/test-support/creation/balance';
import { makeStakingLedger as ledger } from '@polkadot/test-support/creation/stakingInfo/stakingLedger';
import { MemoryStore } from '@polkadot/test-support/keyring';
import { keyring } from '@polkadot/ui-keyring';
import { KeyringJson$Meta } from '@polkadot/ui-keyring/types';

import { AccountOverrides } from '../../test/hooks/default';
import { AccountsPage, format } from '../../test/pages/accountsPage';

describe('Accounts page', () => {
  const aliceAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
  const bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';
  const charlieAddress = '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy';
  const aliceDerivedAddress = '5Dc96kiTPTfZHmq6yTFSqejJzfUNfQQjneNesRWf9MDppJsd';

  const addAccountToKeyring = (address: string, meta: KeyringJson$Meta) => {
    keyring.addExternal(address, meta);
  };

  const forgetAccountFromKeyring = (address: string) => {
    keyring.forgetAccount(address);
  };

  let accountsPage: AccountsPage;

  beforeAll(async () => {
    await i18next.changeLanguage('en');
    keyring.loadAll({ isDevelopment: true, store: new MemoryStore() });
  });

  beforeEach(() => {
    accountsPage = new AccountsPage();
    forgetAccountFromKeyring(aliceDerivedAddress);
  });

  describe('when no accounts', () => {
    beforeEach(() => {
      accountsPage.renderPage([]);
    });

    it('shows a table', async () => {
      const accountsTable = await accountsPage.findAccountsTable();

      expect(accountsTable).not.toBeNull();
    });

    it('the accounts table contains no account rows', async () => {
      const accountRows = await accountsPage.findAccountRows();

      expect(accountRows).toHaveLength(0);
    });

    it('the accounts table contains a message about no accounts available', async () => {
      const accountsTable = await accountsPage.findAccountsTable();
      const noAccountsMessage = await within(accountsTable).findByText(
        'You don\'t have any accounts. Some features are currently hidden and will only become available once you have accounts.');

      expect(noAccountsMessage).not.toBeNull();
    });

    it('no summary is displayed', () => {
      const summaries = screen.queryAllByTestId(/card-summary:total \w+/i);

      expect(summaries).toHaveLength(0);
    });
  });

  describe('when some accounts exist', () => {
    it('the accounts table contains some account rows', async () => {
      renderDefaultAccounts(2);

      const accountRows = await accountsPage.findAccountRows();

      expect(accountRows).toHaveLength(2);
    });

    it('account rows display the total balance info', async () => {
      renderAccountsWithDefaultAddresses(
        anAccountWithBalance({ freeBalance: balance(500) }),
        anAccountWithBalance({ freeBalance: balance(200), reservedBalance: balance(150) })
      );

      const rows = await accountsPage.findAccountRows();

      await rows[0].assertBalancesTotal(balance(500));
      await rows[1].assertBalancesTotal(balance(350));
    });

    it('account rows display the details balance info', async () => {
      renderAccountsWithDefaultAddresses(
        anAccountWithBalance({ freeBalance: balance(500), lockedBalance: balance(30) }),
        anAccountWithBalance({ availableBalance: balance(50), freeBalance: balance(200), reservedBalance: balance(150) })
      );

      const rows = await accountsPage.findAccountRows();

      await rows[0].assertBalancesDetails([
        { amount: balance(0), name: 'transferrable' },
        { amount: balance(30), name: 'locked' }]);
      await rows[1].assertBalancesDetails([
        { amount: balance(50), name: 'transferrable' },
        { amount: balance(150), name: 'reserved' }]);
    });

    it('derived account displays parent account info', async () => {
      addAccountToKeyring(aliceDerivedAddress, { parentAddress: aliceAddress });

      renderAccountsForAddresses(
        aliceAddress,
        aliceDerivedAddress
      );

      const accountRows = await accountsPage.findAccountRows();

      expect(accountRows).toHaveLength(2);
      await accountRows[1].assertParentAccountName('ALICE');
    });

    it('a separate column for parent account is not displayed', async () => {
      renderDefaultAccounts(1);
      const accountsTable = await accountsPage.findAccountsTable();

      assertColumnNotExistInTable('parent', accountsTable);
      assertColumnExistsInTable('type', accountsTable);
    });

    it('account rows display the shorted address', async () => {
      renderAccountsForAddresses(
        aliceAddress
      );
      const accountRows = await accountsPage.findAccountRows();

      expect(accountRows).toHaveLength(1);
      const aliceShortAddress = toShortAddress(aliceAddress);

      await accountRows[0].assertShortAddress(aliceShortAddress);
    });

    it('when account is not tagged, account row details displays no tags info', async () => {
      renderDefaultAccounts(1);
      const rows = await accountsPage.findAccountRows();

      await rows[0].assertTags('no tags');
    });

    it('when account is tagged, account row details displays tags', async () => {
      renderAccountsWithDefaultAddresses(
        anAccountWithInfo({ tags: ['my tag', 'Super Tag'] })
      );

      const rows = await accountsPage.findAccountRows();

      await rows[0].assertTags('my tagSuper Tag');
    });

    it('account details rows keep colouring from their primary rows', async () => {
      renderDefaultAccounts(3);

      const rows = await accountsPage.findAccountRows();

      expect(rows[0].primaryRow).toHaveClass('isOdd');
      expect(rows[0].detailsRow).toHaveClass('isOdd');

      expect(rows[1].primaryRow).toHaveClass('isEven');
      expect(rows[1].detailsRow).toHaveClass('isEven');

      expect(rows[2].primaryRow).toHaveClass('isOdd');
      expect(rows[2].detailsRow).toHaveClass('isOdd');
    });

    it('account details rows toggled on icon toggle click', async () => {
      renderDefaultAccounts(1);

      const row = (await accountsPage.findAccountRows())[0];
      const toggle = await within(row.primaryRow).findByTestId('row-toggle');

      expect(row.detailsRow).toHaveClass('isCollapsed');

      fireEvent.click(toggle);

      expect(row.detailsRow).toHaveClass('isExpanded');
    });

    it('displays some summary', () => {
      renderAccountsWithDefaultAddresses(
        anAccountWithBalance({ freeBalance: balance(500) }),
        anAccountWithBalance({ freeBalance: balance(200), reservedBalance: balance(150) })
      );

      const summaries = screen.queryAllByTestId(/card-summary:total \w+/i);

      expect(summaries).not.toHaveLength(0);
    });

    it('displays balance summary', async () => {
      renderAccountsWithDefaultAddresses(
        anAccountWithBalance({ freeBalance: balance(500) }),
        anAccountWithBalance({ freeBalance: balance(200), reservedBalance: balance(150) })
      );

      const summary = await screen.findByTestId(/card-summary:(total )?balance/i);

      expect(summary).toHaveTextContent(showBalance(500 + 200 + 150));
    });

    it('displays transferable summary', async () => {
      renderAccountsWithDefaultAddresses(
        anAccountWithBalance({ availableBalance: balance(400) }),
        anAccountWithBalance({ availableBalance: balance(600) })
      );

      const summary = await screen.findByTestId(/card-summary:(total )?transferrable/i);

      expect(summary).toHaveTextContent(showBalance(400 + 600));
    });

    it('displays locked summary', async () => {
      renderAccountsWithDefaultAddresses(
        anAccountWithBalance({ lockedBalance: balance(400) }),
        anAccountWithBalance({ lockedBalance: balance(600) })
      );

      const summary = await screen.findByTestId(/card-summary:(total )?locked/i);

      expect(summary).toHaveTextContent(showBalance(400 + 600));
    });

    it('displays bonded summary', async () => {
      renderAccountsWithDefaultAddresses(
        anAccountWithStaking({ stakingLedger: ledger(balance(70)) }),
        anAccountWithStaking({ stakingLedger: ledger(balance(20)) })
      );

      const summary = await screen.findByTestId(/card-summary:(total )?bonded/i);

      expect(summary).toHaveTextContent(showBalance(70 + 20));
    });

    it('displays unbonding summary', async () => {
      renderAccountsWithDefaultAddresses(
        anAccountWithStaking({
          unlocking: [
            {
              remainingEras: new BN('1000000000'),
              value: balance(200)
            },
            {
              remainingEras: new BN('2000000000'),
              value: balance(300)
            },
            {
              remainingEras: new BN('3000000000'),
              value: balance(400)
            }
          ]
        }),
        anAccountWithStaking({
          unlocking: [
            {
              remainingEras: new BN('1000000000'),
              value: balance(100)
            },
            {
              remainingEras: new BN('2000000000'),
              value: balance(200)
            },
            {
              remainingEras: new BN('3000000000'),
              value: balance(300)
            }
          ]
        })
      );

      const summary = await screen.findByTestId(/card-summary:(total )?unbonding/i);

      expect(summary).toHaveTextContent(showBalance(200 + 300 + 400 + 100 + 200 + 300));
    });

    it('displays redeemable summary', async () => {
      renderAccountsWithDefaultAddresses(
        anAccountWithStaking({ redeemable: balance(4000) }),
        anAccountWithStaking({ redeemable: balance(5000) })
      );

      const summary = await screen.findByTestId(/card-summary:(total )?redeemable/i);

      expect(summary).toHaveTextContent(showBalance(4000 + 5000));
    });
  });

  /**
   * Creates a balance instance for testing purposes which most often do not need to specifiy/use decimal part.
   * @param amountInt Integer part of the balance number
   * @param decimalsString Decimals part of the balance number. Note! This is a string sequence just after '.' separator
   *  that is the point that separates integers from decimals. E.g. (100, 4567) => 100.45670000...00
   */
  const balance = function (amountInt: number, decimalsString?: string): Balance {
    const decimalsPadded = (decimalsString || '').padEnd(12, '0');

    return balanceOf(amountInt.toString() + decimalsPadded);
  };

  const anAccount = (): AccountOverrides => ({});

  const anAccountWithBalance = (balance: { [P in keyof DeriveBalancesAll]?: DeriveBalancesAll[P] }) => ({
    balance
  });

  const anAccountWithInfo = (info: { [P in keyof UseAccountInfo]?: UseAccountInfo[P] }) => ({
    info
  });

  const anAccountWithStaking = (staking: { [P in keyof DeriveStakingAccount]?: DeriveStakingAccount[P]}) => ({
    staking
  });

  function assertColumnNotExistInTable (columnName: string, table: HTMLElement) {
    expect(within(table).queryByRole('columnheader', { name: columnName })).toBeFalsy();
  }

  function assertColumnExistsInTable (columnName: string, table: HTMLElement) {
    expect(within(table).getByRole('columnheader', { name: columnName })).toBeTruthy();
  }

  function showBalance (amount: number): string {
    return format(balance(amount));
  }

  const defaultAddresses = [
    aliceAddress,
    bobAddress,
    charlieAddress
  ];

  function renderAccountsWithDefaultAddresses (...overrides: AccountOverrides[]): void {
    const accounts = overrides.map((accountProperties, index) =>
      [defaultAddresses[index], accountProperties] as [string, AccountOverrides]);

    accountsPage.renderPage(accounts);
  }

  function renderAccountsForAddresses (...addresses: string[]): void {
    const accounts = addresses.map((address) => [address, anAccount()] as [string, AccountOverrides]);

    accountsPage.renderPage(accounts);
  }

  function renderDefaultAccounts (accountsNumber: number): void {
    const accounts = Array.from({ length: accountsNumber },
      (_, index) => [defaultAddresses[index], anAccount()] as [string, AccountOverrides]);

    accountsPage.renderPage(accounts);
  }
});
