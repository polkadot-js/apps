// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {render,RenderResult} from '@testing-library/react';
import React, {Suspense} from 'react';
import {MemoryRouter} from 'react-router-dom';
import {ThemeProvider} from 'styled-components';
import BN from "bn.js";

import {lightTheme} from '@polkadot/apps/themes';
import {ApiContext} from '@polkadot/react-api';
import {ApiProps} from '@polkadot/react-api/types';
import {QueueProvider} from '@polkadot/react-components/Status/Context';
import {QueueProps, QueueTxExtrinsicAdd} from '@polkadot/react-components/Status/types';
import Payouts from '@polkadot/app-staking/Payouts';
import registry from "@polkadot/react-api/typeRegistry";
import {StakerState} from "@polkadot/react-hooks/types";

class NotYetRendered extends Error {}

export class PayoutsPage {
  renderResult?: RenderResult;

  renderPage (ownValidators: StakerState[] = []) {
    this.renderPayouts(ownValidators);
  }

  private renderPayouts (ownValidators: StakerState[]) {
    const mockApi: ApiProps = {
      api: {
        consts: {
          staking: {
            maxNominatorRewardedPerValidator: registry.createType('u32', 16)
          }
        },
        derive: {
          accounts: {
            info: () => Promise.resolve(() => {})
          },
          session: {
            eraLength: () => new BN(1000)
          }
        },
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
        //registry: { chainDecimals: [12], chainTokens: ['Unit'] },
        tx: {
          staking: {
            payoutStakers: () => {}
          }
        }
      },
      systemName: 'substrate'
    } as unknown as ApiProps;

    const queue = {queueExtrinsic: jest.fn() as QueueTxExtrinsicAdd} as QueueProps;

    let content = <>
      <div id='tooltips'/>
      <Suspense fallback='...'>
        <QueueProvider value={queue}>
          <MemoryRouter>
            <ThemeProvider theme={lightTheme}>
              <ApiContext.Provider value={mockApi}>
                <Payouts ownValidators={ownValidators}/>
              </ApiContext.Provider>
            </ThemeProvider>
          </MemoryRouter>
        </QueueProvider>
      </Suspense>
    </>;

    if (!this.hasBeenRendered()) {
      this.renderResult = render(content);
    } else {
      this.renderResult!.rerender(content);
    }
  }

  private hasBeenRendered () {
    return this.renderResult !== undefined;
  }

  private assertRendered () {
    if (!this.hasBeenRendered()) {
      throw new NotYetRendered();
    }
  }

  async expectText (expected: string): Promise<void> {
    this.assertRendered();
    expect(await this.renderResult!.findByText(expected)).toBeTruthy();
  }

  async expectMyValidators (expected: {isDisabled: boolean, isSelected: boolean}): Promise<void> {
    this.assertRendered();
    const validators = await this.renderResult!.findByText('My validators') as HTMLButtonElement;
    expect(validators).toBeVisible();

    if (expected.isDisabled)
      expect(validators.classList).toContain('isDisabled');

    if (expected.isSelected)
      expect(validators.classList).toContain('isSelected');
  }
}
