// Copyright 2017-2021 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { screen } from '@testing-library/react';
import BN from 'bn.js';

import i18next from '@polkadot/react-components/i18n';
import { toShortAddress } from '@polkadot/react-components/util/toShortAddress';
import { anAccountWithBalance, anAccountWithBalanceAndMeta, anAccountWithInfo, anAccountWithMeta, anAccountWithStaking } from '@polkadot/test-support/creation/account';
import { makeStakingLedger as ledger } from '@polkadot/test-support/creation/stakingInfo/stakingLedger';
import { alice, MemoryStore } from '@polkadot/test-support/keyring';
import { Table } from '@polkadot/test-support/pagesElements';
import { balance, showBalance } from '@polkadot/test-support/utils/balance';
import { keyring } from '@polkadot/ui-keyring';

import { AccountsPage } from '../../test/pages/accountsPage';

describe('Accounts page', () => {
  let accountsPage: AccountsPage;

  beforeAll(async () => {
    await i18next.changeLanguage('en');

    if (keyring.getAccounts().length === 0) {
      keyring.loadAll({ isDevelopment: true, store: new MemoryStore() });
    }
  });

  beforeEach(() => {
    accountsPage = new AccountsPage();
    accountsPage.clearAccounts();
  });

  describe('when no accounts', () => {
    beforeEach(() => {
      accountsPage.render([]);
    });

    it('shows sort-by controls', async () => {
      await accountsPage.reverseSortingOrder();
    });

    it('shows a table', async () => {
      const accountsTable = await accountsPage.getTable();

      expect(accountsTable).not.toBeNull();
    });

    it('the accounts table contains no account rows', async () => {
      const accountRows = await accountsPage.getAccountRows();

      expect(accountRows).toHaveLength(0);
    });

    it('the accounts table contains a message about no accounts available', async () => {
      const noAccountsMessage = 'You don\'t have any accounts. Some features are currently hidden and will only become available once you have accounts.';
      const accountsTable = await accountsPage.getTable();

      await accountsTable.assertText(noAccountsMessage);
    });

    it('no summary is displayed', () => {
      const summaries = screen.queryAllByTestId(/card-summary:total \w+/i);

      expect(summaries).toHaveLength(0);
    });
  });

  describe('when some accounts exist', () => {
    it('the accounts table contains some account rows', async () => {
      accountsPage.renderDefaultAccounts(2);
      const accountRows = await accountsPage.getAccountRows();

      expect(accountRows).toHaveLength(2);
    });

    it('account rows display the total balance info', async () => {
      accountsPage.renderAccountsWithDefaultAddresses(
        anAccountWithBalance({ freeBalance: balance(500) }),
        anAccountWithBalance({ freeBalance: balance(200), reservedBalance: balance(150) })
      );

      const rows = await accountsPage.getAccountRows();

      await rows[0].assertBalancesTotal(balance(500));
      await rows[1].assertBalancesTotal(balance(350));
    });

    it('account rows display the details balance info', async () => {
      accountsPage.renderAccountsWithDefaultAddresses(
        anAccountWithBalance({ freeBalance: balance(500), lockedBalance: balance(30) }),
        anAccountWithBalance({ availableBalance: balance(50), freeBalance: balance(200), reservedBalance: balance(150) })
      );

      const rows = await accountsPage.getAccountRows();

      await rows[0].assertBalancesDetails([
        { amount: balance(0), name: 'transferrable' },
        { amount: balance(30), name: 'locked' }]);
      await rows[1].assertBalancesDetails([
        { amount: balance(50), name: 'transferrable' },
        { amount: balance(150), name: 'reserved' }]);
    });

    it('derived account displays parent account info', async () => {
      accountsPage.renderAccountsWithDefaultAddresses(
        anAccountWithMeta({ isInjected: true, name: 'ALICE', whenCreated: 200 }),
        anAccountWithMeta({ name: 'ALICE_CHILD', parentAddress: alice, whenCreated: 300 })
      );

      const accountRows = await accountsPage.getAccountRows();

      expect(accountRows).toHaveLength(2);
      await accountRows[1].assertParentAccountName('ALICE');
    });

    it('a separate column for parent account is not displayed', async () => {
      accountsPage.renderDefaultAccounts(1);
      const accountsTable = await accountsPage.getTable();

      accountsTable.assertColumnNotExist('parent');
      accountsTable.assertColumnExists('type');
    });

    it('account rows display the shorted address', async () => {
      accountsPage.renderAccountsForAddresses(
        alice
      );
      const accountRows = await accountsPage.getAccountRows();

      expect(accountRows).toHaveLength(1);
      const aliceShortAddress = toShortAddress(alice);

      await accountRows[0].assertShortAddress(aliceShortAddress);
    });

    it('when account is not tagged, account row details displays no tags info', async () => {
      accountsPage.renderDefaultAccounts(1);
      const rows = await accountsPage.getAccountRows();

      await rows[0].assertTags('no tags');
    });

    it('when account is tagged, account row details displays tags', async () => {
      accountsPage.renderAccountsWithDefaultAddresses(
        anAccountWithInfo({ tags: ['my tag', 'Super Tag'] })
      );

      const rows = await accountsPage.getAccountRows();

      await rows[0].assertTags('my tagSuper Tag');
    });

    it('account details rows keep colouring from their primary rows', async () => {
      accountsPage.renderDefaultAccounts(3);
      const accountsTable = await accountsPage.getTable();

      await accountsTable.assertColoring();
    });

    it('account details rows toggled on icon toggle click', async () => {
      accountsPage.renderDefaultAccounts(1);
      const row = (await accountsPage.getAccountRows())[0];

      expect(row.detailsRow).toHaveClass('isCollapsed');

      await row.expand();

      expect(row.detailsRow).toHaveClass('isExpanded');
    });

    it('displays some summary', () => {
      accountsPage.renderAccountsWithDefaultAddresses(
        anAccountWithBalance({ freeBalance: balance(500) }),
        anAccountWithBalance({ freeBalance: balance(200), reservedBalance: balance(150) })
      );

      const summaries = screen.queryAllByTestId(/card-summary:total \w+/i);

      expect(summaries).not.toHaveLength(0);
    });

    it('displays balance summary', async () => {
      accountsPage.renderAccountsWithDefaultAddresses(
        anAccountWithBalance({ freeBalance: balance(500) }),
        anAccountWithBalance({ freeBalance: balance(200), reservedBalance: balance(150) })
      );

      const summary = await screen.findByTestId(/card-summary:(total )?balance/i);

      expect(summary).toHaveTextContent(showBalance(500 + 200 + 150));
    });

    it('displays transferable summary', async () => {
      accountsPage.renderAccountsWithDefaultAddresses(
        anAccountWithBalance({ availableBalance: balance(400) }),
        anAccountWithBalance({ availableBalance: balance(600) })
      );

      const summary = await screen.findByTestId(/card-summary:(total )?transferrable/i);

      expect(summary).toHaveTextContent(showBalance(400 + 600));
    });

    it('displays locked summary', async () => {
      accountsPage.renderAccountsWithDefaultAddresses(
        anAccountWithBalance({ lockedBalance: balance(400) }),
        anAccountWithBalance({ lockedBalance: balance(600) })
      );

      const summary = await screen.findByTestId(/card-summary:(total )?locked/i);

      expect(summary).toHaveTextContent(showBalance(400 + 600));
    });

    it('displays bonded summary', async () => {
      accountsPage.renderAccountsWithDefaultAddresses(
        anAccountWithStaking({ stakingLedger: ledger(balance(70)) }),
        anAccountWithStaking({ stakingLedger: ledger(balance(20)) })
      );

      const summary = await screen.findByTestId(/card-summary:(total )?bonded/i);

      expect(summary).toHaveTextContent(showBalance(70 + 20));
    });

    it('displays unbonding summary', async () => {
      accountsPage.renderAccountsWithDefaultAddresses(
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
      accountsPage.renderAccountsWithDefaultAddresses(
        anAccountWithStaking({ redeemable: balance(4000) }),
        anAccountWithStaking({ redeemable: balance(5000) })
      );

      const summary = await screen.findByTestId(/card-summary:(total )?redeemable/i);

      expect(summary).toHaveTextContent(showBalance(4000 + 5000));
    });

    it('sorts accounts by date by default', async () => {
      accountsPage.renderAccountsWithDefaultAddresses(
        anAccountWithBalanceAndMeta({ freeBalance: balance(1) }, { whenCreated: 200 }),
        anAccountWithBalanceAndMeta({ freeBalance: balance(2) }, { whenCreated: 300 }),
        anAccountWithBalanceAndMeta({ freeBalance: balance(3) }, { whenCreated: 100 })
      );
      expect(await accountsPage.getCurrentSortCategory()).toHaveTextContent('date');

      const accountsTable = await accountsPage.getTable();

      await accountsTable.assertRowsOrderAndColoring([3, 1, 2]);
    });

    describe('when sorting is used', () => {
      let accountsTable: Table;

      beforeEach(async () => {
        accountsPage.renderAccountsWithDefaultAddresses(
          anAccountWithBalanceAndMeta({ freeBalance: balance(1) }, { isInjected: true, name: 'bbb', whenCreated: 200 }),
          anAccountWithBalanceAndMeta({ freeBalance: balance(2) }, {
            hardwareType: 'ledger',
            isHardware: true,
            name: 'bb',
            parentAddress: alice,
            whenCreated: 300
          }),
          anAccountWithBalanceAndMeta({ freeBalance: balance(3) }, { isInjected: true, name: 'aaa', whenCreated: 100 })
        );

        accountsTable = await accountsPage.getTable();
      });

      it('changes default dropdown value', async () => {
        await accountsPage.sortBy('balances');
        expect(await accountsPage.getCurrentSortCategory())
          .toHaveTextContent('balances');
      });

      it('sorts by parent if asked', async () => {
        await accountsPage.sortBy('parent');
        await accountsTable.assertRowsOrderAndColoring([3, 1, 2]);
      });

      it('sorts by name if asked', async () => {
        await accountsPage.sortBy('name');
        await accountsTable.assertRowsOrderAndColoring([3, 2, 1]);
      });

      it('sorts by date if asked', async () => {
        await accountsPage.sortBy('date');
        await accountsTable.assertRowsOrderAndColoring([3, 1, 2]);
      });

      it('sorts by balances if asked', async () => {
        await accountsPage.sortBy('balances');
        await accountsTable.assertRowsOrderAndColoring([1, 2, 3]);
      });

      it('sorts by type if asked', async () => {
        await accountsPage.sortBy('type');
        await accountsTable.assertRowsOrderAndColoring([3, 1, 2]);
      });

      it('implements stable sort', async () => {
        // Notice that sorting by 'type' results in different order
        // depending on the previous state.
        await accountsPage.sortBy('name');
        await accountsTable.assertRowsOrderAndColoring([3, 2, 1]);
        await accountsPage.sortBy('type');
        await accountsTable.assertRowsOrderAndColoring([3, 1, 2]);
        await accountsPage.sortBy('balances');
        await accountsTable.assertRowsOrderAndColoring([1, 2, 3]);
        await accountsPage.sortBy('type');
        await accountsTable.assertRowsOrderAndColoring([1, 3, 2]);
        await accountsTable.assertColoring();
      });

      it('respects reverse button', async () => {
        await accountsPage.sortBy('name');
        await accountsTable.assertRowsOrderAndColoring([3, 2, 1]);
        await accountsPage.sortBy('balances');
        await accountsTable.assertRowsOrderAndColoring([1, 2, 3]);
        await accountsPage.reverseSortingOrder();
        await accountsTable.assertRowsOrderAndColoring([3, 2, 1]);
        await accountsPage.sortBy('name');
        await accountsTable.assertRowsOrderAndColoring([1, 2, 3]);
      });
    });
  });
});
