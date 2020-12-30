// Copyright 2017-2020 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBounties } from '@polkadot/api-derive/types';
import type { BlockNumber, Bounty } from '@polkadot/types/interfaces';

import { fireEvent, render } from '@testing-library/react';
import BN from 'bn.js';
import React, { Suspense } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import Bounties from '@polkadot/app-bounties/Bounties';
import { BountyApi, BountyContext } from '@polkadot/app-bounties/providers/BountyContext';
import { lightTheme } from '@polkadot/apps/themes';
import { ApiContext } from '@polkadot/react-api';
import { ApiProps } from '@polkadot/react-api/types';
import i18next from '@polkadot/react-components/i18n';
import { TypeRegistry } from '@polkadot/types/create';

import { BalanceApi, BalanceContext } from './providers/BalanceContext';

function aBounty (): Bounty {
  return new TypeRegistry().createType('Bounty');
}

describe('Bounties', () => {
  beforeAll(async () => {
    await i18next.changeLanguage('en');
  });

  const renderBounties = (bountyApi: Partial<BountyApi> = {}) => {
    const bountyApiDefault: BountyApi = {
      bestNumber: new BN(1) as BlockNumber,
      bounties: [] as DeriveBounties,
      bountyDepositBase: new BN(1),
      bountyValueMinimum: new BN(1),
      dataDepositPerByte: new BN(1),
      maximumReasonLength: 100,
      proposeBounty: jest.fn()
    };

    const balanceContextDefault: BalanceApi = {
      accountId: null,
      balance: undefined,
      setAccountId: () => { /**/ }
    };

    const mockApi: ApiProps = { api: {
      derive: { accounts: { info: () => Promise.resolve(() => { /**/ }) } },
      query: {},
      registry: { chainDecimals: 12 }
    },
    systemName: 'substrate' } as ApiProps;

    return render(
      <Suspense fallback='...'>
        <MemoryRouter>
          <ThemeProvider theme={lightTheme}>
            <ApiContext.Provider value={mockApi}>
              <BalanceContext.Provider value={balanceContextDefault}>
                <BountyContext.Provider value={{ ...bountyApiDefault, ...bountyApi }} >
                  <Bounties/>
                </BountyContext.Provider>
              </BalanceContext.Provider>
            </ApiContext.Provider>
          </ThemeProvider>
        </MemoryRouter>
      </Suspense>
    );
  };

  it('shows empty list when no bounties', async () => {
    const { findByText } = renderBounties();

    expect(await findByText('No open bounties')).toBeTruthy();
  });

  it('renders a bounty', async () => {
    const { findByText, queryAllByText } = renderBounties({ bounties: [{ bounty: aBounty(), description: 'kusama comic book' }] });

    expect(await findByText('kusama comic book')).toBeTruthy();
    expect(queryAllByText('No open bounties')).toHaveLength(0);
  });

  describe('create bounty modal', () => {
    it('validates bounty length', async () => {
      const { findByTestId, findByText } = renderBounties({ maximumReasonLength: 5 });

      const addBountyButton = await findByText('Add Bounty');

      fireEvent.click(addBountyButton);

      const titleInput = await findByTestId('bounty title');

      fireEvent.change(titleInput, { target: { value: 'longer than 5' } });

      expect(await findByText('Title too long')).toBeTruthy();
    });
  });
});
