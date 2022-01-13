// Copyright 2017-2022 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { queryByAttribute, render, RenderResult, screen } from '@testing-library/react';
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
import { mockApiHooks } from '@polkadot/test-support/utils/mockApiHooks';
import { TypeRegistry } from '@polkadot/types/create';
import { keyring } from '@polkadot/ui-keyring';
import { BN } from '@polkadot/util';

import { alice, bob, charlie, ferdie } from '../keyring';
import { Table } from '../pagesElements';
import { AccountOverrides, mockAccountHooks } from '../utils/accountDefaults';

let queueExtrinsic: (value: PartialQueueTxExtrinsic) => void;

class NotYetRendered extends Error {
}

jest.mock('@polkadot/react-hooks/useAccounts', () => ({
  useAccounts: () => mockAccountHooks.useAccounts
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
          identity: {
            ...actual.useAccountInfo(address).identity,
            ...(mockInfo.info.identity),
            judgements: [
              ...(actual.useAccountInfo(address).identity?.judgements || []),
              ...(mockApiHooks.judgements || [])
            ]
          },
          tags: [...actual.useAccountInfo(address).tags, ...(mockInfo.info.tags)]
        }
        : actual.useAccountInfo(address);
    }
  });
});

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

jest.mock('@polkadot/react-hooks/useSubidentities', () => ({
  useSubidentities: () => mockApiHooks.subs
}));

jest.mock('@polkadot/app-accounts/Accounts/useMultisigApprovals', () => ({
  __esModule: true,
  default: () => mockApiHooks.multisigApprovals
}));

jest.mock('@polkadot/react-hooks/useDelegations', () => ({
  useDelegations: () => mockApiHooks.delegations
}));

jest.mock('@polkadot/react-hooks/useProxies', () => ({
  useProxies: () => mockApiHooks.proxies
}));

jest.mock('@polkadot/react-hooks/useSubidentities', () => ({
  useSubidentities: () => mockApiHooks.subs
}));

jest.mock('@polkadot/react-hooks/useRegistrars', () => ({
  useRegistrars: () => ({
    isRegistrar: false,
    registrars: mockApiHooks.registrars
  })
}));

export abstract class Page {
  private renderResult?: RenderResult;
  protected readonly defaultAddresses = [alice, bob, charlie, ferdie];

  protected constructor (private readonly overview: React.ReactElement, private readonly rowClassName: string) {
    this.overview = overview;
    this.rowClassName = rowClassName;
  }

  render (accounts: [string, AccountOverrides][]): void {
    mockAccountHooks.setAccounts(accounts);

    accounts.forEach(([address, { meta }]) => {
      keyring.addExternal(address, meta);
    });

    const noop = () => Promise.resolve(() => { /**/ });
    const mockApi: ApiProps = {
      api: {
        consts: {
          babe: {
            expectedBlockTime: new BN(1)
          },
          democracy: {
            enactmentPeriod: new BN(1)
          },
          proxy: {
            proxyDepositBase: new BN(1),
            proxyDepositFactor: new BN(1)
          }
        },
        createType: () => ({
          defKeys: []
        }),
        derive: {
          accounts: {
            info: noop
          },
          balances: {
            all: noop
          },
          chain: {
            bestNumber: noop
          },
          democracy: {
            locks: noop
          },
          staking: {
            account: noop
          }
        },
        genesisHash: new TypeRegistry().createType('Hash', POLKADOT_GENESIS),
        query: {
          democracy: {
            votingOf: noop
          },
          identity: {
            identityOf: noop
          }
        },
        registry: {
          chainDecimals: [12],
          chainTokens: ['Unit'],
          lookup: {
            names: []
          }
        },
        tx: {
          council: {},
          democracy: {
            delegate: noop
          },
          multisig: {
            approveAsMulti: Object.assign(noop, { meta: { args: [] } })
          },
          proxy: {
            removeProxies: noop
          },
          utility: noop
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
                    {React.cloneElement(this.overview, { onStatusChange: noop }) }
                  </AccountSidebar>
                </ApiContext.Provider>
              </ThemeProvider>
            </MemoryRouter>
          </QueueProvider>
        </Suspense>
      </>
    );
  }

  async getTable (): Promise<Table> {
    this.assertRendered();

    return new Table(await screen.findByRole('table'), this.rowClassName);
  }

  clearAccounts (): void {
    this.defaultAddresses.forEach((address) => keyring.forgetAccount(address));
  }

  getById (id: string | RegExp): HTMLElement | null {
    this.assertRendered();
    const getById = queryByAttribute.bind(null, 'id');

    return getById(this.renderResult?.container ?? fail('Page render failed'), id);
  }

  protected assertRendered (): void {
    if (this.renderResult === undefined) {
      throw new NotYetRendered();
    }
  }
}
