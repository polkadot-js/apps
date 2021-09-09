// Copyright 2017-2021 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Balance } from '@polkadot/types/interfaces';

import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import BN from 'bn.js';

import { DeriveBalancesAll, DeriveStakingAccount } from '@polkadot/api-derive/types';
import i18next from '@polkadot/react-components/i18n';
import toShortAddress from '@polkadot/react-components/util/toShortAddress';
import { AddressFlags, UseAccountInfo } from '@polkadot/react-hooks/types';
import { balanceOf } from '@polkadot/test-support/creation/balance';
import { makeStakingLedger as ledger } from '@polkadot/test-support/creation/stakingInfo/stakingLedger';
import { MemoryStore } from '@polkadot/test-support/keyring';
import { keyring } from '@polkadot/ui-keyring';
import { KeyringJson$Meta } from '@polkadot/ui-keyring/types';

import { AccountOverrides, Override } from '../../test/hooks/default';
import { AccountRow } from '../../test/pageElements/AccountRow';
import { Sidebar } from '../../test/pageElements/Sidebar';
import { AccountsPage, format } from '../../test/pages/accountsPage';

describe('Accounts page', () => {
  const aliceAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
  const bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';
  const charlieAddress = '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy';

  let accountsPage: AccountsPage;

  beforeAll(async () => {
    await i18next.changeLanguage('en');

    if (keyring.getAccounts().length === 0) {
      keyring.loadAll({ isDevelopment: true, store: new MemoryStore() });
    }
  });

  beforeEach(() => {
    defaultAddresses.forEach((address) => keyring.forgetAccount(address));
    accountsPage = new AccountsPage();
  });

  describe('when no accounts', () => {
    beforeEach(() => {
      accountsPage.renderPage([]);
    });

    it('shows sort-by controls', async () => {
      const section = await accountsPage.findSortBySection();

      expect(section).not.toBeNull();

      const button = await accountsPage.findSortByReverseButton();

      expect(button).not.toBeNull();
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
      renderAccountsWithDefaultAddresses(
        anAccountWithMeta({ isInjected: true, name: 'ALICE', whenCreated: 200 }),
        anAccountWithMeta({ name: 'ALICE_CHILD', parentAddress: aliceAddress, whenCreated: 300 })
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

      await accountsPage.checkRowsColoring();
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

    it('sorts accounts by date by default', async () => {
      renderAccountsWithDefaultAddresses(
        anAccountWithBalanceAndMeta({ freeBalance: balance(1) }, { whenCreated: 200 }),
        anAccountWithBalanceAndMeta({ freeBalance: balance(2) }, { whenCreated: 300 }),
        anAccountWithBalanceAndMeta({ freeBalance: balance(3) }, { whenCreated: 100 })
      );

      expect(await accountsPage.findSortByDropdownCurrent()).toHaveTextContent('date');
      await accountsPage.checkOrderAndRowsColoring([3, 1, 2]);
    });

    describe('when sorting is used', () => {
      beforeEach(() => {
        renderAccountsWithDefaultAddresses(
          anAccountWithBalanceAndMeta({ freeBalance: balance(1) }, { isInjected: true, name: 'bbb', whenCreated: 200 }),
          anAccountWithBalanceAndMeta({ freeBalance: balance(2) }, {
            hardwareType: 'ledger',
            isHardware: true,
            name: 'bb',
            parentAddress: aliceAddress,
            whenCreated: 300
          }),
          anAccountWithBalanceAndMeta({ freeBalance: balance(3) }, { isInjected: true, name: 'aaa', whenCreated: 100 })
        );
      });

      it('changes default dropdown value', async () => {
        await accountsPage.selectOrder('balances');
        expect(await accountsPage.findSortByDropdownCurrent())
          .toHaveTextContent('balances');
      });

      it('sorts by parent if asked', async () => {
        await accountsPage.selectOrder('parent');
        await accountsPage.checkOrderAndRowsColoring([3, 1, 2]);
      });

      it('sorts by name if asked', async () => {
        await accountsPage.selectOrder('name');
        await accountsPage.checkOrderAndRowsColoring([3, 2, 1]);
      });

      it('sorts by date if asked', async () => {
        await accountsPage.selectOrder('date');
        await accountsPage.checkOrderAndRowsColoring([3, 1, 2]);
      });

      it('sorts by balances if asked', async () => {
        await accountsPage.selectOrder('balances');
        await accountsPage.checkOrderAndRowsColoring([1, 2, 3]);
      });

      it('sorts by type if asked', async () => {
        await accountsPage.selectOrder('type');
        await accountsPage.checkOrderAndRowsColoring([3, 1, 2]);
      });

      it('implements stable sort', async () => {
        // Notice that sorting by 'type' results in different order
        // depending on the previous state.
        await accountsPage.selectOrder('name');
        await accountsPage.checkOrderAndRowsColoring([3, 2, 1]);
        await accountsPage.selectOrder('type');
        await accountsPage.checkOrderAndRowsColoring([3, 1, 2]);
        await accountsPage.selectOrder('balances');
        await accountsPage.checkOrderAndRowsColoring([1, 2, 3]);
        await accountsPage.selectOrder('type');
        await accountsPage.checkOrderAndRowsColoring([1, 3, 2]);
        await accountsPage.checkRowsColoring();
      });

      it('respects reverse button', async () => {
        await accountsPage.selectOrder('name');
        await accountsPage.checkOrderAndRowsColoring([3, 2, 1]);
        await accountsPage.selectOrder('balances');
        await accountsPage.checkOrderAndRowsColoring([1, 2, 3]);
        fireEvent.click(await accountsPage.findSortByReverseButton());
        await accountsPage.checkOrderAndRowsColoring([3, 2, 1]);
        await accountsPage.selectOrder('name');
        await accountsPage.checkOrderAndRowsColoring([1, 2, 3]);
      });
    });

    describe('sidebar', () => {
      const initialName = 'INITIAL_NAME';
      const newName = 'NEW_NAME';
      const defaultTag = 'Default';
      const nameInputNotFoundError = 'Unable to find an element by: [data-testid="name-input"]';

      let accountRows: AccountRow[];
      let sideBar: Sidebar;

      describe('changes name', () => {
        beforeEach(async () => {
          accountsPage.renderPage([[aliceAddress, anAccountWithMeta({ isDevelopment: false, name: initialName })]]);
          sideBar = await openSidebarForAccountRow(0);
          await sideBar.changeAccountName(newName);
        });

        it('within keyring', () => {
          const changedAccount = keyring.getAccount(aliceAddress);

          expect(changedAccount?.meta?.name).toEqual(newName);
        });

        it('within sidebar', async () => {
          await sideBar.assertAccountName(newName);
        });

        it('within account row', async () => {
          await accountRows[0].assertAccountName(newName);
        });
      });

      it('cannot be edited if edit button has not been pressed', async () => {
        await sideBar.clickByText('no tags');
        expect(sideBar.queryByRole('combobox')).toBeFalsy();

        await expect(sideBar.typeAccountName(newName)).rejects.toThrowError(nameInputNotFoundError);
      });

      it('when isEditable is false account name is not editable', async () => {
        renderAccountsWithDefaultAddresses(
          anAccountWithInfo({ flags: { isEditable: false } as AddressFlags })
        );
        sideBar = await openSidebarForAccountRow(0);
        sideBar.edit();
        await expect(sideBar.typeAccountName(newName)).rejects.toThrowError(nameInputNotFoundError);
      });

      describe('on edit cancel', () => {
        beforeEach(async () => {
          accountsPage.renderPage([[aliceAddress, anAccountWithMeta({ isDevelopment: false, name: initialName, tags: [] })]]);

          sideBar = await openSidebarForAccountRow(0);
          await sideBar.assertTags('no tags');
          sideBar.edit();
        });

        it('restores tags and name to state from keyring', async () => {
          await sideBar.typeAccountName(newName);
          await sideBar.selectTag(defaultTag);

          sideBar.cancel();
          await sideBar.assertTags('no tags');
          await sideBar.assertAccountName(initialName);
        });

        it('Cancel button disappears', () => {
          sideBar.cancel();
          expect(sideBar.queryByRole('button', { name: 'Cancel' })).toBeFalsy();
        });
      });

      describe('outside click', () => {
        beforeEach(async () => {
          renderAccountsWithDefaultAddresses(
            anAccountWithMeta({ name: 'alice' }),
            anAccountWithMeta({ name: 'bob' })
          );

          sideBar = await openSidebarForAccountRow(0);
          sideBar.edit();
        });

        it('cancels editing', async () => {
          await sideBar.typeAccountName(newName);
          await sideBar.selectTag(defaultTag);

          fireEvent.click(await screen.findByText('accounts'));

          await sideBar.assertTags('no tags');
          await sideBar.assertAccountName('ALICE');

          expect(sideBar.queryByRole('button', { name: 'Cancel' })).toBeFalsy();
        });

        it('within sidebar does not cancel editing', async () => {
          await sideBar.clickByText('Tags');

          expect(sideBar.queryByRole('button', { name: 'Cancel' })).toBeTruthy();
        });

        it('cancels editing and changes name when opening sidebar for another account', async () => {
          await waitFor(() => sideBar.assertAccountInput('alice'));

          sideBar = await openSidebarForAccountRow(1);
          await sideBar.assertAccountName('BOB');
        });
      });

      async function openSidebarForAccountRow (rowIndex: number) {
        accountRows = await accountsPage.findAccountRows();

        return accountRows[rowIndex].openSidebar();
      }
    });
  });

  const anAccount = (): AccountOverrides => ({});

  const anAccountWithBalance = (balance: Override<DeriveBalancesAll>) => ({
    balance
  });

  const anAccountWithBalanceAndMeta = (balance: Override<DeriveBalancesAll>, meta: Override<KeyringJson$Meta>) => ({
    balance,
    meta
  });

  const anAccountWithInfo = (info: Override<UseAccountInfo>) => ({
    info
  });

  const anAccountWithMeta = (meta: Override<KeyringJson$Meta>) => ({
    meta
  });

  const anAccountWithStaking = (staking: Override<DeriveStakingAccount>) => ({
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

  const defaultAddresses = [aliceAddress, bobAddress, charlieAddress];

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

/**
 * Creates a balance instance for testing purposes which most often do not need to specifiy/use decimal part.
 * @param amountInt Integer part of the balance number
 * @param decimalsString Decimals part of the balance number. Note! This is a string sequence just after '.' separator
 *  that is the point that separates integers from decimals. E.g. (100, 4567) => 100.45670000...00
 */
export const balance = function (amountInt: number, decimalsString?: string): Balance {
  const decimalsPadded = (decimalsString || '').padEnd(12, '0');

  return balanceOf(amountInt.toString() + decimalsPadded);
};
