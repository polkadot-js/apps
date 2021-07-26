// Copyright 2017-2021 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { within } from '@testing-library/react';

import i18next from '@polkadot/react-components/i18n';
import { MemoryStore } from '@polkadot/test-support/keyring';
import { keyring } from '@polkadot/ui-keyring';
import { formatBalance } from '@polkadot/util';

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
        { _id: '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy', freeBalance: 10000 },
        { _id: '5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw', freeBalance: 999 }
      ]);

      const accountRows = await accountsPage.findAccountRows();

      expect(accountRows).toHaveLength(2);
    });

    it('account rows display the total balance info', async () => {
      accountsPage.renderPage([
        { _id: '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy', freeBalance: 500 },
        { _id: '5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw', freeBalance: 200, reservedBalance: 150 }
      ]);
      const rows = await accountsPage.findAccountRows();

      const row1TotalActual = await within(rows[0]).findByTestId('balance-summary');
      const row1TotalExpected = formatBalance(500, { decimals: 0, withUnit: true });

      expect(row1TotalActual).toHaveTextContent(row1TotalExpected);

      const row2TotalActual = await within(rows[1]).findByTestId('balance-summary');
      const row2TotalExpected = formatBalance(350, { decimals: 0, withUnit: true });

      expect(row2TotalActual).toHaveTextContent(row2TotalExpected);
    });
  });
});
