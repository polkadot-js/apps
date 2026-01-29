// Copyright 2017-2025 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

/// <reference types="@polkadot/dev-test/globals.d.ts" />

import '@polkadot/react-components/i18n';

import { render } from '@testing-library/react';
import React, { Suspense } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { ApiCtxRoot } from '@polkadot/react-api';
import { lightTheme } from '@polkadot/react-components';
import { createApi } from '@polkadot/test-support/api';
import { aliceSigner, MemoryStore } from '@polkadot/test-support/keyring';
import { WaitForApi } from '@polkadot/test-support/react';
import { execute } from '@polkadot/test-support/transaction';
import { BN } from '@polkadot/util';

import BountiesApp from './index.js';

const SUBSTRATE_PORT = Number.parseInt(process.env.TEST_SUBSTRATE_PORT || '30333');

const renderBounties = () => {
  const memoryStore = new MemoryStore();

  return render(
    <Suspense fallback='...'>
      <MemoryRouter>
        <ThemeProvider theme={lightTheme}>
          <ApiCtxRoot
            apiUrl={`ws://127.0.0.1:${SUBSTRATE_PORT}`}
            isElectron={false}
            store={memoryStore}
          >
            <WaitForApi>
              <div>
                <BountiesApp basePath='/bounties' />
              </div>
            </WaitForApi>
          </ApiCtxRoot>
        </ThemeProvider>
      </MemoryRouter>
    </Suspense>
  );
};

// eslint-disable-next-line jest/no-disabled-tests
describe.skip('--SLOW--: Bounties', () => {
  it('list shows an existing bounty', async () => {
    const api = await createApi();

    await execute(api.tx.bounties.proposeBounty(new BN(500_000_000_000_000), 'a short bounty title'), aliceSigner());

    const { findByText } = renderBounties();

    expect(await findByText('a short bounty title', {}, { timeout: 20_000 })).toBeTruthy();
  });
});
