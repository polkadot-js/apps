// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { fireEvent, render } from '@testing-library/react';
import React, { Suspense } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { ApiPromise } from '@polkadot/api';
import { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import Bounties from '@polkadot/app-bounties/Bounties';
import { BountyApi } from '@polkadot/app-bounties/hooks';
import { lightTheme } from '@polkadot/apps/themes';
import { POLKADOT_GENESIS } from '@polkadot/apps-config';
import { ApiContext } from '@polkadot/react-api';
import { ApiProps } from '@polkadot/react-api/types';
import { QueueProvider } from '@polkadot/react-components/Status/Context';
import { QueueProps, QueueTxExtrinsicAdd } from '@polkadot/react-components/Status/types';
import { balanceOf } from '@polkadot/test-support/creation/balance';
import { BountyFactory } from '@polkadot/test-support/creation/bounties/bountyFactory';
import { TypeRegistry } from '@polkadot/types/create';
import { Bounty, BountyIndex, BountyStatus } from '@polkadot/types/interfaces';

import { defaultBalance, defaultBountyApi } from '../hooks/defaults';

const mockBountyApi = defaultBountyApi;
const mockBalance = defaultBalance;

export const mocks = {
  mockBalance,
  mockBountyApi
};

jest.mock('../../src/hooks', () => ({
  useBalance: () => mocks.mockBalance,
  useBounties: () => mocks.mockBountyApi
}));

function aGenesisHash () {
  return new TypeRegistry().createType('Hash', POLKADOT_GENESIS);
}

type FindByText = (text: string) => Promise<HTMLElement>;

type FindByTestId = (testId: string) => Promise<HTMLElement>;

class NotYetRendered extends Error {

}

export class BountiesPage {
  aBounty: ({ status, value }?: Partial<Bounty>) => Bounty;
  aBountyIndex: (index?:number) => BountyIndex;
  aBountyStatus: (status: string) => BountyStatus;
  bountyStatusWith: ({ curator, status }: { curator?: string, status?: string, }) => BountyStatus;
  bountyWith: ({ status, value }: { status?: string, value?: number }) => Bounty;

  findByText?: FindByText;
  findByTestId?: FindByTestId;

  constructor (api: ApiPromise) {
    ({ aBounty: this.aBounty, aBountyIndex: this.aBountyIndex, aBountyStatus: this.aBountyStatus, bountyStatusWith: this.bountyStatusWith, bountyWith: this.bountyWith } = new BountyFactory(api));
  }

  renderOne (bounty: Bounty, proposals: DeriveCollectiveProposal[] = [], description = '', index = this.aBountyIndex()) {
    const { findByTestId, findByText } = this.renderBounties({ bounties: [{ bounty, description, index, proposals }] });

    this.findByText = findByText;
    this.findByTestId = findByTestId;

    return { findByTestId, findByText };
  }

  renderBounties (bountyApi: Partial<BountyApi> = {}, { balance = 1 } = {}) {
    mocks.mockBountyApi = { ...mockBountyApi, ...bountyApi };
    mocks.mockBalance = balanceOf(balance);
    const mockApi: ApiProps = {
      api: {
        derive: {
          accounts: {
            info: () => Promise.resolve(() => { /**/
            })
          }
        },
        genesisHash: aGenesisHash(),
        query: {},
        registry: { chainDecimals: [12], chainTokens: ['Unit'] },
        tx: {
          council: {
            propose: jest.fn()
          }
        }
      },
      systemName: 'substrate'
    } as unknown as ApiProps;

    const queue = {
      queueExtrinsic: jest.fn() as QueueTxExtrinsicAdd
    } as QueueProps;

    return render(
      <Suspense fallback='...'>
        <QueueProvider value={queue}>
          <MemoryRouter>
            <ThemeProvider theme={lightTheme}>
              <ApiContext.Provider value={mockApi}>
                <Bounties/>
              </ApiContext.Provider>
            </ThemeProvider>
          </MemoryRouter>
        </QueueProvider>
      </Suspense>
    );
  }

  async openProposeCurator (): Promise<void> {
    if (!this.assertRendered()) {
      throw new NotYetRendered();
    }

    const proposeCuratorButton = await this.findByText('Propose Curator');

    fireEvent.click(proposeCuratorButton);
    expect(await this.findByText('This action will create a Council motion to assign a Curator.')).toBeTruthy();
  }

  private assertRendered (): this is {findByText: FindByText} {
    return this.findByText !== undefined;
  }
}
