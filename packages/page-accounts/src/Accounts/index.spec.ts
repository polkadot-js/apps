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

import { AccountOverrides } from '../../test/hooks/default';
import { AccountRow } from '../../test/pageElements/AccountRow';
import { Sidebar } from '../../test/pageElements/Sidebar';
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

    describe('sidebar', () => {
      const injectedAddress = '5CcZRy9WTK3NBXNxcrwK67EsVRAUsfxSQAhmSwJHtGtYwJqu';
      const initialName = 'ANAME';
      const newName = 'CHARLIE';
      const defaultTag = 'Default';

      let accountRows: AccountRow[];
      let sideBar: Sidebar;

      describe('changes', () => {
        beforeEach(async () => {
          addAccountToKeyring(injectedAddress, { isDevelopment: false, name: initialName });
          renderAccountsForAddresses(
            injectedAddress
          );
          sideBar = await openSidebarForAccountRow(0);
        });

        describe('name', () => {
          beforeEach(async () => {
            await sideBar.changeAccountName(newName);
          });

          it('within keyring', () => {
            const changedAccount = keyring.getAccount(injectedAddress);

            expect(changedAccount?.meta?.name).toEqual(newName);
          });

          it('within sidebar', async () => {
            await sideBar.assertAccountName(newName);
          });

          it('within account row', async () => {
            await accountRows[0].assertAccountName(newName);
          });
        });

        describe('tags', () => {
          beforeEach(async () => {
            await sideBar.setTag(defaultTag);
          });

          it('within sidebar', async () => {
            await waitFor(() => sideBar.tagsEqual(defaultTag));
          });

          it('within account row', async () => {
            await waitFor(() => accountRows[0].tagsEqual(defaultTag));
          });
        });
      });

      describe('when isEditable is false', () => {
        beforeEach(async () => {
          renderAccountsWithDefaultAddresses(
            anAccountWithInfo({ flags: { isEditable: false } as AddressFlags })
          );
          sideBar = await openSidebarForAccountRow(0);
        });

        it('account name is not editable', async () => {
          const inputNotFoundError = 'Unable to find an element by: [data-testid="name-input"]';

          sideBar.edit();
          await expect(sideBar.typeAccountName(newName)).rejects.toThrowError(inputNotFoundError);
        });

        it('tags are editable', async () => {
          await sideBar.setTag(defaultTag);
          await waitFor(() => sideBar.tagsEqual(defaultTag));
          await waitFor(() => accountRows[0].tagsEqual(defaultTag));
        });
      });

      describe('cannot be edited', () => {
        beforeEach(async () => {
          renderAccountsWithDefaultAddresses(
            anAccountWithInfo({ flags: { isEditable: false } as AddressFlags })
          );
          sideBar = await openSidebarForAccountRow(0);
        });

        describe('if edit button has not been pressed', () => {
          it('tags', async () => {
            await sideBar.clickByText('no tags');
            expect(sideBar.queryByRole('combobox')).toBeFalsy();
          });

          it('account name', async () => {
            const inputNotFoundError = 'Unable to find an element by: [data-testid="name-input"]';

            await expect(sideBar.typeAccountName(newName)).rejects.toThrowError(inputNotFoundError);
          });
        });
      });

      describe('on edit cancel', () => {
        beforeEach(async () => {
          addAccountToKeyring(injectedAddress, { isDevelopment: false, name: initialName, tags: [] });
          renderAccountsForAddresses(
            injectedAddress
          );
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
          renderAccountsForAddresses(
            aliceAddress,
            bobAddress
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
          await waitFor(() => sideBar.accountNameEquals('ALICE'));

          sideBar = await openSidebarForAccountRow(1);
          await sideBar.assertAccountName('BOB');
        });
      });

      afterEach(() => {
        keyring.forgetAccount(injectedAddress);
        keyring.forgetAddress(injectedAddress);
      });

      async function openSidebarForAccountRow (rowIndex: number) {
        accountRows = await accountsPage.findAccountRows();

        return accountRows[rowIndex].openSidebar();
      }
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
