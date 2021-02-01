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
import { PartialQueueTxExtrinsic, QueueProps, QueueTxExtrinsicAdd } from '@polkadot/react-components/Status/types';
import { balanceOf } from '@polkadot/test-support/creation/balance';
import { BountyFactory } from '@polkadot/test-support/creation/bounties/bountyFactory';
import { TypeRegistry } from '@polkadot/types/create';
import { Bounty, BountyIndex, BountyStatus } from '@polkadot/types/interfaces';

import { mockBountyHooks } from '../hooks/defaults';

function aGenesisHash () {
  return new TypeRegistry().createType('Hash', POLKADOT_GENESIS);
}
type FindByRole = (role: string) => Promise<HTMLElement>;

type FindByText = (text: string) => Promise<HTMLElement>;

type FindByTestId = (testId: string) => Promise<HTMLElement>;

type GetAllByRole = (role: string) => HTMLElement[];

class NotYetRendered extends Error {

}

let queueExtrinsic: (value: PartialQueueTxExtrinsic) => void;
const propose = jest.fn().mockReturnValue('mockProposeExtrinsic');

export class BountiesPage {
  aBounty: ({ status, value }?: Partial<Bounty>) => Bounty;
  aBountyIndex: (index?:number) => BountyIndex;
  aBountyStatus: (status: string) => BountyStatus;
  bountyStatusWith: ({ curator, status }: { curator?: string, status?: string, }) => BountyStatus;
  bountyWith: ({ status, value }: { status?: string, value?: number }) => Bounty;

  findByRole?: FindByRole;
  findByText?: FindByText;
  findByTestId?: FindByTestId;
  getAllByRole?: GetAllByRole;

  constructor (api: ApiPromise) {
    ({ aBounty: this.aBounty, aBountyIndex: this.aBountyIndex, aBountyStatus: this.aBountyStatus, bountyStatusWith: this.bountyStatusWith, bountyWith: this.bountyWith } = new BountyFactory(api));
  }

  renderOne (bounty: Bounty, proposals: DeriveCollectiveProposal[] = [], description = '', index = this.aBountyIndex()) {
    const { findByRole, findByTestId, findByText, getAllByRole } = this.renderBounties({ bounties: [{ bounty, description, index, proposals }] });

    this.findByRole = findByRole;
    this.findByText = findByText;
    this.findByTestId = findByTestId;
    this.getAllByRole = getAllByRole;

    return { findByRole, findByTestId, findByText, getAllByRole };
  }

  renderBounties (bountyApi: Partial<BountyApi> = {}, { balance = 1 } = {}) {
    mockBountyHooks.bountyApi = { ...mockBountyHooks.bountyApi, ...bountyApi };
    mockBountyHooks.balance = balanceOf(balance);
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
            propose
          }
        }
      },
      systemName: 'substrate'
    } as unknown as ApiProps;

    queueExtrinsic = jest.fn() as QueueTxExtrinsicAdd;
    const queue = {
      queueExtrinsic
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

  private assertRendered (): asserts this is {findByText: FindByText, findByTestId: FindByTestId, getAllByRole: GetAllByRole} {
    if (this.findByText === undefined) {
      throw new NotYetRendered();
    }
  }

  async openProposeCurator (): Promise<void> {
    this.assertRendered();
    const proposeCuratorButton = await this.findByText('Propose Curator');

    fireEvent.click(proposeCuratorButton);
    expect(await this.findByText('This action will create a Council motion to assign a Curator.')).toBeTruthy();
  }

  async enterCuratorsFee (fee: string): Promise<void> {
    this.assertRendered();
    const feeInput = await this.findByTestId("curator's fee");

    fireEvent.change(feeInput, { target: { value: fee } });
  }

  async expectText (expected: string): Promise<void> {
    this.assertRendered();
    expect(await this.findByText(expected)).toBeTruthy();
  }

  async assignCuratorButton (): Promise<HTMLElement> {
    this.assertRendered();

    return this.findByText('Assign curator');
  }

  enterProposingAccount (account: string) {
    this.assertRendered();
    const comboboxes = this.getAllByRole('combobox');

    const proposingAccountInput = comboboxes[0].children[0];

    fireEvent.change(proposingAccountInput, { target: { value: account } });
    fireEvent.keyDown(proposingAccountInput, { code: 'Enter', key: 'Enter' });
  }

  enterProposedCurator (curator: string) {
    this.assertRendered();
    const comboboxes = this.getAllByRole('combobox');

    const proposedCuratorInput = comboboxes[1].children[0];

    fireEvent.change(proposedCuratorInput, { target: { value: curator } });
    fireEvent.keyDown(proposedCuratorInput, { code: 'Enter', key: 'Enter' });
  }

  expectExtrinsicQueued (extrinsicPart: { accountId: string; extrinsic: string }): void {
    expect(queueExtrinsic).toHaveBeenCalledWith(expect.objectContaining(extrinsicPart));
  }
}
