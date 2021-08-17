// Copyright 2017-2021 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Balance } from '@polkadot/types/interfaces';
import type { AccountOverrides } from '../../test/hooks/default';

import { fireEvent, screen, within } from '@testing-library/react';
import BN from 'bn.js';

import i18next from '@polkadot/react-components/i18n';
import { balanceOf } from '@polkadot/test-support/creation/balance';
import { makeStakingLedger as ledger } from '@polkadot/test-support/creation/stakingInfo/stakingLedger';
import { MemoryStore } from '@polkadot/test-support/keyring';
import { keyring } from '@polkadot/ui-keyring';

import { AccountsPage } from '../../test/pages/accountsPage';

describe('Accounts page', () => {
  const aliceAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
  const bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';
  const charlieAddress = '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy';
  const aliceDerivedAddress = '5Dc96kiTPTfZHmq6yTFSqejJzfUNfQQjneNesRWf9MDppJsd';

  let accountsPage: AccountsPage;

  const selectOrder = async (orderBy: string) => {
    const current = await accountsPage.findSortByDropdownCurrent();

    fireEvent.click(current);

    const target = await accountsPage.findSortByDropdownItem(orderBy);

    fireEvent.click(target);
  };

  const checkOrder = async (order: number[]) => {
    const rows = await accountsPage.findAccountRows();
    const rowsBalances = await Promise.all(rows.map((row) => within(row).findByTestId('balance-summary')));
    const expected = order.map((amount) => accountsPage.format(balance(amount)));

    for (let i = 0; i < expected.length; i++) {
      expect(rowsBalances[i]).toHaveTextContent(expected[i]);
    }
  };

  beforeAll(async () => {
    await i18next.changeLanguage('en');
    keyring.loadAll({ isDevelopment: true, store: new MemoryStore() });
  });

  beforeEach(() => {
    defaultAddresses.forEach((addr) => keyring.forgetAccount(addr));
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
      defaultRender(
        {
          balance: {
            freeBalance: balance(10000)
          }
        },
        {
          balance: {
            freeBalance: balance(999)
          }
        });

      const accountRows = await accountsPage.findAccountRows();

      expect(accountRows).toHaveLength(2);
    });

    it('account rows display the total balance info', async () => {
      defaultRender(
        {
          balance: {
            freeBalance: balance(500)
          }
        },
        {
          balance: {
            freeBalance: balance(200),
            reservedBalance: balance(150)
          }
        });
      const rows = await accountsPage.findAccountRows();

      const row1TotalActual = await within(rows[0]).findByTestId('balance-summary');
      const row1TotalExpected = accountsPage.format(balance(500));

      expect(row1TotalActual).toHaveTextContent(row1TotalExpected);

      const row2TotalActual = await within(rows[1]).findByTestId('balance-summary');
      const row2TotalExpected = accountsPage.format(balance(350));

      expect(row2TotalActual).toHaveTextContent(row2TotalExpected);
    });

    it('displays some summary', () => {
      defaultRender(
        {
          balance: {
            freeBalance: balance(500)
          }
        },
        {
          balance: {
            freeBalance: balance(200),
            reservedBalance: balance(150)
          }
        });

      const summaries = screen.queryAllByTestId(/card-summary:total \w+/i);

      expect(summaries).not.toHaveLength(0);
    });

    it('displays balance summary', async () => {
      defaultRender(
        {
          balance: {
            freeBalance: balance(500)
          }
        },
        {
          balance: {
            freeBalance: balance(200),
            reservedBalance: balance(150)
          }
        });

      const summary = await screen.findByTestId(/card-summary:(total )?balance/i);

      expect(summary).toHaveTextContent(showBalance(500 + 200 + 150));
    });

    it('displays transferrable summary', async () => {
      defaultRender({ balance: { availableBalance: balance(400) } }, { balance: { availableBalance: balance(600) } });

      const summary = await screen.findByTestId(/card-summary:(total )?transferrable/i);

      expect(summary).toHaveTextContent(showBalance(400 + 600));
    });

    it('displays locked summary', async () => {
      defaultRender({ balance: { lockedBalance: balance(400) } }, { balance: { lockedBalance: balance(600) } });

      const summary = await screen.findByTestId(/card-summary:(total )?locked/i);

      expect(summary).toHaveTextContent(showBalance(400 + 600));
    });

    it('displays bonded summary', async () => {
      defaultRender(
        {
          staking: {
            stakingLedger: ledger(balance(70))
          }
        },
        {
          staking: {
            stakingLedger: ledger(balance(20))
          }
        });

      const summary = await screen.findByTestId(/card-summary:(total )?bonded/i);

      expect(summary).toHaveTextContent(showBalance(70 + 20));
    });

    it('displays unbonding summary', async () => {
      defaultRender(
        {
          staking: {
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
          }
        },
        {
          staking: {
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
          }
        });

      const summary = await screen.findByTestId(/card-summary:(total )?unbonding/i);

      expect(summary).toHaveTextContent(showBalance(200 + 300 + 400 + 100 + 200 + 300));
    });

    it('displays redeemable summary', async () => {
      defaultRender({ staking: { redeemable: balance(4000) } }, { staking: { redeemable: balance(5000) } });

      const summary = await screen.findByTestId(/card-summary:(total )?redeemable/i);

      expect(summary).toHaveTextContent(showBalance(4000 + 5000));
    });

    it('sorts them by date by default', async () => {
      defaultRender(
        {
          balance: {
            freeBalance: balance(1)
          },
          meta: {
            whenCreated: 200
          }
        },
        {
          balance: {
            freeBalance: balance(2)
          },
          meta: {
            whenCreated: 300
          }
        },
        {
          balance: {
            freeBalance: balance(3)
          },
          meta: {
            whenCreated: 100
          }
        });

      expect(await accountsPage.findSortByDropdownCurrent()).toHaveTextContent('date');
      await checkOrder([3, 1, 2]);
    });

    describe('when sorting is used', () => {
      beforeEach(() => {
        defaultRender(
          {
            balance: {
              freeBalance: balance(1)
            },
            meta: {
              isInjected: true,
              name: 'bbb',
              whenCreated: 200
            }
          },
          {
            balance: {
              freeBalance: balance(2)
            },
            meta: {
              hardwareType: 'ledger',
              isHardware: true,
              name: 'bb',
              parentAddress: aliceAddress,
              whenCreated: 300
            }
          },
          {
            balance: {
              freeBalance: balance(3)
            },
            meta: {
              isInjected: true,
              name: 'aaa',
              whenCreated: 100
            }
          });
      });

      it('changes default dropdown value', async () => {
        await selectOrder('balances');
        expect(await accountsPage.findSortByDropdownCurrent())
          .toHaveTextContent('balances');
      });

      it('sorts by parent if asked', async () => {
        await selectOrder('parent');
        await checkOrder([3, 1, 2]);
      });

      it('sorts by name if asked', async () => {
        await selectOrder('name');
        await checkOrder([3, 2, 1]);
      });

      it('sorts by date if asked', async () => {
        await selectOrder('date');
        await checkOrder([3, 1, 2]);
      });

      it('sorts by balances if asked', async () => {
        await selectOrder('balances');
        await checkOrder([1, 2, 3]);
      });

      it('sorts by type if asked', async () => {
        await selectOrder('type');
        await checkOrder([3, 1, 2]);
      });

      it('implements stable sort', async () => {
        // Notice that sorting by 'type' results in different order
        // depending on the previous state.
        await selectOrder('name');
        await checkOrder([3, 2, 1]);
        await selectOrder('type');
        await checkOrder([3, 1, 2]);
        await selectOrder('balances');
        await checkOrder([1, 2, 3]);
        await selectOrder('type');
        await checkOrder([1, 3, 2]);
      });

      it('respects reverse button', async () => {
        await selectOrder('name');
        await checkOrder([3, 2, 1]);
        await selectOrder('balances');
        await checkOrder([1, 2, 3]);
        fireEvent.click(await accountsPage.findSortByReverseButton());
        await checkOrder([3, 2, 1]);
        await selectOrder('name');
        await checkOrder([1, 2, 3]);
      });
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

  const showBalance = function (amount: number): string {
    return accountsPage.format(balance(amount));
  };

  const defaultAddresses = [aliceAddress, bobAddress, charlieAddress, aliceDerivedAddress];

  const defaultRender = function (...overrides: AccountOverrides[]): void {
    const accounts: [string, AccountOverrides][] = [];

    for (let i = 0; i < overrides.length; i++) {
      accounts.push([defaultAddresses[i], overrides[i]]);
    }

    accountsPage.renderPage(accounts);
  };
});
