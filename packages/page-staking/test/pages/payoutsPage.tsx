// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { render } from '@testing-library/react';
import React, { Suspense } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { ApiPromise } from '@polkadot/api';
import { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import { BountyApi } from '@polkadot/app-bounties/hooks';
import { lightTheme } from '@polkadot/apps/themes';
import { POLKADOT_GENESIS } from '@polkadot/apps-config';
import { ApiContext } from '@polkadot/react-api';
import { ApiProps } from '@polkadot/react-api/types';
import { QueueProvider } from '@polkadot/react-components/Status/Context';
import { PartialQueueTxExtrinsic, QueueProps, QueueTxExtrinsicAdd } from '@polkadot/react-components/Status/types';
import { BountyFactory } from '@polkadot/test-support/creation/bounties/bountyFactory';
import { TypeRegistry } from '@polkadot/types/create';
import { Bounty, BountyIndex, BountyStatus } from '@polkadot/types/interfaces';

import Payouts from '@polkadot/app-staking/Payouts';
import BN from "bn.js";
import registry from "@polkadot/react-api/typeRegistry";

function aGenesisHash () {
  return new TypeRegistry().createType('Hash', POLKADOT_GENESIS);
}

type FindOne = (match: string) => Promise<HTMLElement>;
type FindManyWithMatcher = (match: string | ((match: string) => boolean)) => Promise<HTMLElement[]>
type GetMany = (match: string) => HTMLElement[];

class NotYetRendered extends Error {

}

let queueExtrinsic: (value: PartialQueueTxExtrinsic) => void;
const propose = jest.fn().mockReturnValue('mockProposeExtrinsic');

interface RenderedPayoutsPage {
  findAllByTestId: FindManyWithMatcher;
  findByText: FindOne;
  findByRole: FindOne;
  findByTestId: FindOne;
  getAllByRole: GetMany;
  queryAllByText: GetMany;
}

export class PayoutsPage {
  aBounty: ({ status, value }?: Partial<Bounty>) => Bounty;
  aBountyIndex: (index?: number) => BountyIndex;
  aBountyStatus: (status: string) => BountyStatus;
  bountyStatusWith: ({ curator, status }: { curator?: string, status?: string, }) => BountyStatus;
  bountyWith: ({ status, value }: { status?: string, value?: number }) => Bounty;

  findByRole?: FindOne;
  findByText?: FindOne;
  findByTestId?: FindOne;
  getAllByRole?: GetMany;
  findAllByTestId?: FindManyWithMatcher;
  queryAllByText?: GetMany;

  constructor (api: ApiPromise) {
    ({ aBounty: this.aBounty, aBountyIndex: this.aBountyIndex, aBountyStatus: this.aBountyStatus, bountyStatusWith: this.bountyStatusWith, bountyWith: this.bountyWith } = new BountyFactory(api));
  }

  renderOne (bounty: Bounty, proposals: DeriveCollectiveProposal[] = [], description = '', index = this.aBountyIndex()): RenderedPayoutsPage {
    return this.renderMany({ bounties: [{ bounty, description, index, proposals }] });
  }

  renderMany (bountyApi: Partial<BountyApi> = {}, { balance = 1 } = {}): RenderedPayoutsPage {
    const { findAllByTestId, findByRole, findByTestId, findByText, getAllByRole, queryAllByText } = this.renderPayouts();

    this.findByRole = findByRole;
    this.findByText = findByText;
    this.findByTestId = findByTestId;
    this.getAllByRole = getAllByRole;
    this.findAllByTestId = findAllByTestId;
    this.queryAllByText = queryAllByText;

    return { findAllByTestId, findByRole, findByTestId, findByText, getAllByRole, queryAllByText };
  }

  private renderPayouts () {
    const mockApi: ApiProps = {
      api: {
        consts: {
          staking: {
            maxNominatorRewardedPerValidator: registry.createType('u32', 16)
          }
        },
        derive: {
          accounts: {
            info: () => Promise.resolve(() => { /**/
            })
          },
          session: {
            eraLength: () => new BN(1000)
          }
        },
        genesisHash: aGenesisHash(),
        query: {
          staking: {
            historyDepth: () => new BN(1),
            bonded: {
              multi: () => [],
            },
            ledger: {
              multi: () => []
            }
          }
        },
        registry: { chainDecimals: [12], chainTokens: ['Unit'] },
        tx: {
          council: {
            propose
          },
          staking: {
            payoutStakers: () => {}
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
      <>
        <div id='tooltips'/>
        <Suspense fallback='...'>
          <QueueProvider value={queue}>
            <MemoryRouter>
              <ThemeProvider theme={lightTheme}>
                <ApiContext.Provider value={mockApi}>
                  <Payouts ownValidators={[]}/>
                </ApiContext.Provider>
              </ThemeProvider>
            </MemoryRouter>
          </QueueProvider>
        </Suspense>
      </>
    );
  }

  private assertRendered (): asserts this is RenderedPayoutsPage {
    if (this.findByText === undefined) {
      throw new NotYetRendered();
    }
  }

  async expectText (expected: string): Promise<void> {
    this.assertRendered();
    expect(await this.findByText(expected)).toBeTruthy();
  }

  async expectMyValidators (expected: {isDisabled: boolean, isSelected: boolean}): Promise<void> {
    this.assertRendered();
    const validators = await this.findByText('My validators') as HTMLButtonElement;
    expect(validators).toBeVisible();

    if (expected.isDisabled)
      expect(validators.classList).toContain('isDisabled');

    if (expected.isSelected)
      expect(validators.classList).toContain('isSelected');
  }
}
