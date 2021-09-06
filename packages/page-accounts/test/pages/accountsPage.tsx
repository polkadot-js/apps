// Copyright 2017-2021 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { fireEvent, render, RenderResult, screen, within } from '@testing-library/react';
import BN from 'bn.js';
import React, { Suspense } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { balance } from '@polkadot/app-accounts/Accounts/index.spec';
import AccountSidebar from '@polkadot/app-accounts/Sidebar';
import { lightTheme } from '@polkadot/apps/themes';
import { POLKADOT_GENESIS } from '@polkadot/apps-config';
import { ApiContext } from '@polkadot/react-api';
import { ApiProps } from '@polkadot/react-api/types';
import { QueueProvider } from '@polkadot/react-components/Status/Context';
import { PartialQueueTxExtrinsic, QueueProps, QueueTxExtrinsicAdd } from '@polkadot/react-components/Status/types';
import { UseAccountInfo } from '@polkadot/react-hooks/types';
import { TypeRegistry } from '@polkadot/types/create';
import { Balance, BlockNumber } from '@polkadot/types/interfaces';
import { keyring } from '@polkadot/ui-keyring';
import { formatBalance } from '@polkadot/util';

import { AccountOverrides, mockAccountHooks } from '../hooks/default';
import { AccountRow } from '../pageElements/AccountRow';
import Overview from '../pages/../../src/Accounts/index';

let queueExtrinsic: (value: PartialQueueTxExtrinsic) => void;

function noop (): void {
  // ignore
}

class NotYetRendered extends Error {
}

jest.mock('@polkadot/react-hooks/useAccounts', () => ({
  useAccounts: () => mockAccountHooks.useAccounts
}));

jest.mock('@polkadot/react-hooks/useLoadingDelay', () => ({
  useLoadingDelay: () => false
}));

jest.mock('@polkadot/react-hooks/useBalancesAll', () => ({
  useBalancesAll: (address: string) => mockAccountHooks.accountsMap[address].balance
}));

jest.mock('@polkadot/react-hooks/useStakingInfo', () => ({
  useStakingInfo: (address: string) => mockAccountHooks.accountsMap[address].staking
}));

jest.mock('@polkadot/react-hooks/useBestNumber', () => ({
  useBestNumber: () => 1
}));

jest.mock('@polkadot/react-hooks/useAccountInfo', () => {
  // eslint-disable-next-line func-call-spacing
  const actual = jest.requireActual<{useAccountInfo: (address: string) => UseAccountInfo}>('@polkadot/react-hooks/useAccountInfo');

  return ({
    useAccountInfo: (address: string) => {
      const mockInfo = mockAccountHooks.accountsMap[address];

      return mockInfo
        ? {
          ...actual.useAccountInfo(address),
          flags: { ...actual.useAccountInfo(address).flags, ...(mockInfo.info.flags) },
          tags: [...actual.useAccountInfo(address).tags, ...(mockInfo.info.tags)]
        }
        : actual.useAccountInfo(address);
    }
  });
});

export class AccountsPage {
  private renderResult?: RenderResult

  renderPage (accounts: [string, AccountOverrides][]): void {
    mockAccountHooks.setAccounts(accounts);

    accounts.forEach(([address, { meta }]) => {
      keyring.addExternal(address, meta);
    });

    const mockApi: ApiProps = {
      api: {
        derive: {
          accounts: {
            info: () => { /**/ }
          },
          balances: {
            all: () => ({
              accountNonce: mockAccountHooks.nonce,
              additional: [],
              freeBalance: 0,
              lockedBreakdown: [],
              reservedBalance: 0
            })
          },
          chain: {
            bestNumber: () => new BN(1) as BlockNumber
          }
        },
        genesisHash: new TypeRegistry().createType('Hash', POLKADOT_GENESIS),
        query: {},
        registry: { chainDecimals: [12], chainTokens: ['Unit'] },
        tx: {
          council: {
          }
        }
      },
      systemName: 'substrate'
    } as unknown as ApiProps;

    queueExtrinsic = jest.fn() as QueueTxExtrinsicAdd;
    const queue = {
      queueExtrinsic
    } as QueueProps;

    this.renderResult = render(
      <>
        <div id='tooltips' />
        <Suspense fallback='...'>
          <QueueProvider value={queue}>
            <MemoryRouter>
              <ThemeProvider theme={lightTheme}>
                <ApiContext.Provider value={mockApi}>
                  <AccountSidebar>
                    <Overview onStatusChange={noop} />
                  </AccountSidebar>
                </ApiContext.Provider>
              </ThemeProvider>
            </MemoryRouter>
          </QueueProvider>
        </Suspense>
      </>
    );
  }

  async findAccountsTable (): Promise<HTMLElement> {
    this.assertRendered();

    return await screen.findByRole('table');
  }

  async findAccountRows (): Promise<AccountRow[]> {
    const table = await this.findAccountsTable();
    const tableBody = table.getElementsByTagName('tbody')[0];
    const htmlRows = (await within(tableBody).findAllByRole('row'))
      .filter((r) => r.className.startsWith('Account-'));
    const rows: AccountRow[] = [];

    for (let rowIdx = 0; rowIdx < htmlRows.length; rowIdx = rowIdx + 2) {
      const primary = htmlRows[rowIdx];
      const details = htmlRows[rowIdx + 1];

      rows.push(new AccountRow(primary, details));
    }

    return rows;
  }

  async findSortBySection (): Promise<HTMLElement> {
    this.assertRendered();

    return await screen.findByTestId('sort-by-section');
  }

  async findSortByDropdownCurrent (): Promise<HTMLElement> {
    this.assertRendered();

    const section = await this.findSortBySection();
    const alerts = await within(section).findAllByRole('alert');
    const names = await within(section).findAllByText(/\w+/);
    const ret = names.filter((x) => alerts.includes(x));

    expect(ret).toHaveLength(1);

    return ret[0];
  }

  async findSortByDropdownItem (name: string): Promise<HTMLElement> {
    this.assertRendered();

    const section = await this.findSortBySection();
    const alerts = await within(section).findAllByRole('alert');
    const names = await within(section).findAllByText(name);
    const ret = names.filter((x) => !alerts.includes(x));

    expect(ret).toHaveLength(1);

    return ret[0];
  }

  async findSortByReverseButton (): Promise<HTMLElement> {
    this.assertRendered();

    const section = await this.findSortBySection();

    return await within(section).findByRole('button');
  }

  async checkOrder (order: number[]): Promise<void> {
    const rows = await this.findAccountRows();
    const rowsBalances = await Promise.all(rows.map((row) => within(row.primaryRow).findByTestId('balance-summary')));
    const expected = order.map((amount) => this.format(balance(amount)));

    for (let i = 0; i < expected.length; i++) {
      expect(rowsBalances[i]).toHaveTextContent(expected[i]);
    }
  }

  async selectOrder (orderBy: string): Promise<void> {
    const current = await this.findSortByDropdownCurrent();

    fireEvent.click(current);

    const target = await this.findSortByDropdownItem(orderBy);

    fireEvent.click(target);
  }

  async checkRowsColoring (): Promise<void> {
    const rows = await this.findAccountRows();

    rows.forEach((row, index) => {
      const expectedClass = index % 2 ? 'isEven' : 'isOdd';

      expect(row.primaryRow).toHaveClass(expectedClass);
      expect(row.detailsRow).toHaveClass(expectedClass);
    });
  }

  async checkOrderAndRowsColoring (order: number[]): Promise<void> {
    await this.checkOrder(order);
    await this.checkRowsColoring();
  }

  format (amount: Balance | BN): string {
    return formatBalance(amount, { decimals: 12, forceUnit: '-', withUnit: true });
  }

  async enterCreateAccountModal (): Promise<void> {
    this.renderPage([]);

    fireEvent.click(await screen.findByRole('button', { name: 'Add account' }));
    await screen.findByText('Add an account via seed 1/3');
  }

  private assertRendered () {
    if (this.renderResult === undefined) {
      throw new NotYetRendered();
    }
  }
}

export const format = (amount: Balance | BN): string => {
  return formatBalance(amount, { decimals: 12, forceUnit: '-', withUnit: true });
};
