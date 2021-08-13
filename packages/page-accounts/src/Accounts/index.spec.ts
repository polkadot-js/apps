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
import { KeyringJson$Meta } from '@polkadot/ui-keyring/types';

import { AccountOverrides } from '../../test/hooks/default';
import { AccountsPage } from '../../test/pages/accountsPage';

describe('Accounts page', () => {
  const aliceAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
  const bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';
  const charlieAddress = '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy';
  const aliceDerivedAddress = '5Dc96kiTPTfZHmq6yTFSqejJzfUNfQQjneNesRWf9MDppJsd';

  const injectAccount = (address: string, meta: KeyringJson$Meta) => {
    keyring.addExternal(address, meta)
  }

  const forgetAccount = (address: string) => {
    keyring.forgetAccount(address)
  }

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
        anAccount(aliceAddress),
        anAccount(charlieAddress)
      ]);

      const accountRows = await accountsPage.findAccountRows();

      expect(accountRows).toHaveLength(2);
    });

    it('account rows display the total balance info', async () => {
      accountsPage.renderPage([
        anAccountWithBalance(aliceAddress, { freeBalance: balance(500) }),
        anAccountWithBalance(charlieAddress, { freeBalance: balance(200), reservedBalance: balance(150) })
      ]);
      const rows = await accountsPage.findAccountRows();

      await rows[0].assertBalancesTotal(balance(500));
      await rows[1].assertBalancesTotal(balance(350));
    });

    it('account rows display the details balance info', async () => {
      accountsPage.renderPage([
        anAccountWithBalance(aliceAddress, { freeBalance: balance(500), lockedBalance: balance(30) }),
        anAccountWithBalance(charlieAddress, { availableBalance: balance(50), freeBalance: balance(200), reservedBalance: balance(150) })
      ]);
      const rows = await accountsPage.findAccountRows();

      await rows[0].assertBalancesDetails([
        { amount: balance(0), name: 'transferrable' },
        { amount: balance(30), name: 'locked' }]);
      await rows[1].assertBalancesDetails([
        { amount: balance(50), name: 'transferrable' },
        { amount: balance(150), name: 'reserved' }]);
    });

    it('derived account displays parent account info', async () => {
      injectAccount(aliceDerivedAddress, { parentAddress: aliceAddress });
      accountsPage.renderPage([
        anAccount(aliceAddress),
        anAccountWithInfo(aliceDerivedAddress, { meta: { parentAddress: aliceAddress } })
      ]);
      const accountRows = await accountsPage.findAccountRows();

      expect(accountRows).toHaveLength(2);
      await accountRows[1].assertParentAccountName('ALICE');

      forgetAccount(aliceDerivedAddress);
    });

    it('a separate column for parent account is not displayed', async () => {
      accountsPage.renderPage([anAccount()]);
      const accountsTable = await accountsPage.findAccountsTable();

      expect(within(accountsTable).queryByRole('columnheader', { name: 'parent' })).toBeFalsy();
      expect(within(accountsTable).getByRole('columnheader', { name: 'type' })).toBeTruthy();
    });

    it('when account is not tagged, account row details displays no tags info', async () => {
      accountsPage.renderPage([anAccount()]);
      const rows = await accountsPage.findAccountRows();

      await rows[0].assertTags('no tags');
    });

    it('when account is tagged, account row details displays tags', async () => {
      accountsPage.renderPage([
        anAccountWithInfo(aliceAddress, { tags: ['my tag', 'Super Tag'] })
      ]);
      const rows = await accountsPage.findAccountRows();

      await rows[0].assertTags('my tagSuper Tag');
    });

    it('account details rows keep colouring from their primary rows', async () => {
      accountsPage.renderPage([
        anAccount(aliceAddress),
        anAccount(charlieAddress),
        anAccount(bobAddress)
      ]);

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
        anAccount()
      ]);

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

  const defaultFreeBalance = 1000;

  const anAccount = (address: string = aliceAddress): AccountOverrides => ({
    address,
    balance: {
      freeBalance: balance(defaultFreeBalance)
    }
  });

  const anAccountWithBalance = (address: string, balance: { [P in keyof DeriveBalancesAll]?: DeriveBalancesAll[P] }) => ({
    address,
    balance
  });

  const anAccountWithInfo = (address: string, info: { [P in keyof UseAccountInfo]?: UseAccountInfo[P] }) => ({
    address,
    balance: {
      freeBalance: balance(defaultFreeBalance)
    },
    info
  });
});
