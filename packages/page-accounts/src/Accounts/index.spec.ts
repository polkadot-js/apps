// Copyright 2017-2021 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Balance } from '@polkadot/types/interfaces';

import { fireEvent, within } from '@testing-library/react';

import { DeriveBalancesAll } from '@polkadot/api-derive/types';
import i18next from '@polkadot/react-components/i18n';
import { UseAccountInfo } from '@polkadot/react-hooks/types';
import { balanceOf } from '@polkadot/test-support/creation/balance';
import { MemoryStore } from '@polkadot/test-support/keyring';
import { keyring } from '@polkadot/ui-keyring';

import { AccountOverrides } from '../../test/hooks/default';
import { AccountsPage } from '../../test/pages/accountsPage';

describe('Accounts page', () => {
  const accountsAddresses = ['5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy', '5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw'];
  const defaultBalance = 1000;

  let accountsPage: AccountsPage;

  beforeAll(async () => {
    await i18next.changeLanguage('en');
    keyring.loadAll({ isDevelopment: true, store: new MemoryStore() });
  });

  beforeEach(() => {
    accountsPage = new AccountsPage();
  });

  describe('when no accounts', () => {
    it('shows a table', async () => {
      accountsPage.renderPage([]);

      const accountsTable = await accountsPage.findAccountsTable();

      expect(accountsTable).not.toBeNull();
    });

    it('the accounts table contains no account rows', async () => {
      accountsPage.renderPage([]);

      const accountRows = await accountsPage.findAccountRows();

      expect(accountRows).toHaveLength(0);
    });

    it('the accounts table contains a message about no accounts available', async () => {
      accountsPage.renderPage([]);

      const accountsTable = await accountsPage.findAccountsTable();
      const noAccountsMessage = await within(accountsTable).findByText(
        'You don\'t have any accounts. Some features are currently hidden and will only become available once you have accounts.');

      expect(noAccountsMessage).not.toBeNull();
    });
  });

  describe('when some accounts exist', () => {
    it('the accounts table contains some account rows', async () => {
      accountsPage.renderPage([anAccount(accountsAddresses[0]), anAccount(accountsAddresses[1])]);

      const accountRows = await accountsPage.findAccountRows();

      expect(accountRows).toHaveLength(2);
    });

    it('account rows display the total balance info', async () => {
      accountsPage.renderPage([
        anAccountWithBalance(accountsAddresses[0], { freeBalance: balance(500) }),
        anAccountWithBalance(accountsAddresses[1], { freeBalance: balance(200), reservedBalance: balance(150) })
      ]);
      const rows = await accountsPage.findAccountRows();

      await rows[0].assertBalancesTotal(balance(500));
      await rows[1].assertBalancesTotal(balance(350));
    });

    it('account rows display the details balance info', async () => {
      accountsPage.renderPage([
        anAccountWithBalance(accountsAddresses[0], { freeBalance: balance(500), lockedBalance: balance(30) }),
        anAccountWithBalance(accountsAddresses[1], { availableBalance: balance(50), freeBalance: balance(200), reservedBalance: balance(150) })
      ]);
      const rows = await accountsPage.findAccountRows();

      await rows[0].assertBalancesDetails([
        { amount: balance(0), name: 'transferrable' },
        { amount: balance(30), name: 'locked' }]);
      await rows[1].assertBalancesDetails([
        { amount: balance(50), name: 'transferrable' },
        { amount: balance(150), name: 'reserved' }]);
    });

    it('account row displays parent account info', async () => {
      accountsPage.renderPage([
        anAccount(accountsAddresses[0]),
        anAccountWithInfo(accountsAddresses[1], { meta: { parentAddress: accountsAddresses[0] } })
      ]);

      const accountRows = await accountsPage.findAccountRows();

      expect(accountRows).toHaveLength(2);
    });

    it('a separate column for parent account is not displayed', async () => {
      accountsPage.renderPage([anAccount()]);
      const accountsTable = await accountsPage.findAccountsTable();

      expect(within(accountsTable).queryByRole('columnheader', { name: 'parent' })).toBeFalsy();
      expect(within(accountsTable).getByRole('columnheader', { name: 'type' })).toBeTruthy();
    });

    it('when account is not tagged, account row details displays no tags info', async () => {
      accountsPage.renderPage([{ address: '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy' }]);
      const rows = await accountsPage.findAccountRows();

      await rows[0].assertTags('no tags');
    });

    it('when account is tagged, account row details displays tags', async () => {
      accountsPage.renderPage([
        {
          address: '5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw',
          info: {
            tags: ['my tag', 'Super Tag']
          }
        }
      ]);
      const rows = await accountsPage.findAccountRows();

      await rows[0].assertTags('my tagSuper Tag');
    });

    it('account details rows keep colouring from their primary rows', async () => {
      accountsPage.renderPage([
        { address: '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy' },
        { address: '5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw' },
        { address: '5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc' }]);

      const rows = await accountsPage.findAccountRows();

      expect(rows[0].primaryRow).toHaveClass('isOdd');
      expect(rows[0].detailsRow).toHaveClass('isOdd');

      expect(rows[1].primaryRow).toHaveClass('isEven');
      expect(rows[1].detailsRow).toHaveClass('isEven');

      expect(rows[2].primaryRow).toHaveClass('isOdd');
      expect(rows[2].detailsRow).toHaveClass('isOdd');
    });

    it('account details rows toggled on icon toggle click', async () => {
      accountsPage.renderPage([
        { address: '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy' }]);

      const row = (await accountsPage.findAccountRows())[0];
      const toggle = await within(row.primaryRow).findByTestId('row-toggle');

      expect(row.detailsRow).toHaveClass('isCollapsed');

      fireEvent.click(toggle);

      expect(row.detailsRow).toHaveClass('isExpanded');
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

  const anAccount = (address: string = accountsAddresses[0]): AccountOverrides => ({
    address,
    balance: {
      freeBalance: balance(defaultBalance)
    }
  });

  const anAccountWithBalance = (address: string, balance: { [P in keyof DeriveBalancesAll]?: DeriveBalancesAll[P] }) => ({
    address,
    balance
  });

  const anAccountWithInfo = (address: string, info: { [P in keyof UseAccountInfo]?: UseAccountInfo[P] }) => ({
    address,
    balance: {
      freeBalance: balance(defaultBalance)
    },
    info
  });
});
