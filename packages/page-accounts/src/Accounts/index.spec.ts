// Copyright 2017-2021 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Balance } from '@polkadot/types/interfaces';

import { within } from '@testing-library/react';

import i18next from '@polkadot/react-components/i18n';
import { balanceOf } from '@polkadot/test-support/creation/balance';
import { MemoryStore } from '@polkadot/test-support/keyring';
import { keyring } from '@polkadot/ui-keyring';

import { AccountsPage } from '../../test/pages/accountsPage';

describe('Accounts page', () => {
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
      accountsPage.renderPage([
        {
          address: '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy',
          balance: {
            freeBalance: balance(10000)
          }
        },
        {
          address: '5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw',
          balance: {
            freeBalance: balance(999)
          }
        }
      ]);

      const accountRows = await accountsPage.findAccountRows();

      expect(accountRows).toHaveLength(2);
    });

    it('account rows display the total balance info', async () => {
      accountsPage.renderPage([
        {
          address: '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy',
          balance: {
            freeBalance: balance(500)
          }
        },
        {
          address: '5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw',
          balance: {
            freeBalance: balance(200),
            reservedBalance: balance(150)
          }
        }
      ]);
      const rows = await accountsPage.findAccountRows();

      const row1TotalActual = await within(rows[0]).findByTestId('balance-summary');
      const row1TotalExpected = accountsPage.format(balance(500));

      expect(row1TotalActual).toHaveTextContent(row1TotalExpected);

      const row2TotalActual = await within(rows[1]).findByTestId('balance-summary');
      const row2TotalExpected = accountsPage.format(balance(350));

      expect(row2TotalActual).toHaveTextContent(row2TotalExpected);
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
});
