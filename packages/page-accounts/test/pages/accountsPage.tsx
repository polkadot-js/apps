// Copyright 2017-2021 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { fireEvent, render, RenderResult, screen, within } from '@testing-library/react';
import BN from 'bn.js';
import React, { Suspense } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

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

// utility wrapper over an account item in accounts table, serves basic assertions about an account row

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
        : actual;
    }
  });
});

export class AccountsPage {
  private renderResult?: RenderResult

  renderPage (accounts: [string, AccountOverrides][]): void {
    mockAccountHooks.setAccounts(accounts);
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
