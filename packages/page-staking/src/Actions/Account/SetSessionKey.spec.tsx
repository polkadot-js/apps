// Copyright 2017-2026 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

/// <reference types="@polkadot/dev-test/globals.d.ts" />

import type { QueueProps, QueueTxExtrinsic } from '@polkadot/react-components/Status/types';
import type { ApiProps } from '@polkadot/react-hooks/ctx/types';

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'styled-components';

import { lightTheme } from '@polkadot/react-components';
import i18next from '@polkadot/react-components/i18n';
import { ApiCtx } from '@polkadot/react-hooks/ctx/Api';
import { QueueCtx } from '@polkadot/react-hooks/ctx/Queue';
import { alice, bob, MemoryStore } from '@polkadot/test-support/keyring';
import { keyring } from '@polkadot/ui-keyring';
import { cryptoWaitReady } from '@polkadot/util-crypto';

import SetSessionKey from './SetSessionKey.js';

describe('Session Key signing account', () => {
  beforeAll(async () => {
    await cryptoWaitReady();
    await i18next.changeLanguage('en');

    if (keyring.getAccounts().length === 0) {
      keyring.loadAll({ isDevelopment: true, store: new MemoryStore() });
    }
  });

  afterEach(cleanup);

  for (const specName of ['quip', 'polkadot']) {
    it(`queues keys signed by the ${specName === 'quip' ? 'stash on Quip' : 'controller on a legacy chain'}`, async () => {
      let queued: QueueTxExtrinsic | undefined;
      const setKeys = (keys: string, proof: string | Uint8Array) => ({ keys, proof });
      const context = { api: { runtimeVersion: { specName }, tx: { session: { setKeys } } }, apiEndpoint: null, isEthereum: false, specName, systemName: 'substrate' } as unknown as ApiProps;
      const queue = { queueExtrinsic: (tx: QueueTxExtrinsic): void => {
        queued = tx;
      } } as unknown as QueueProps;
      const onClose = jest.fn();

      render(
        <Suspense fallback='...'>
          <ThemeProvider theme={lightTheme}>
            <ApiCtx.Provider value={context}>
              <QueueCtx.Provider value={queue}>
                <SetSessionKey
                  controllerId={bob}
                  onClose={onClose}
                  stashId={alice}
                />
              </QueueCtx.Provider>
            </ApiCtx.Provider>
          </ThemeProvider>
        </Suspense>
      );
      const inputs = await screen.findAllByPlaceholderText('0x...');

      fireEvent.change(inputs[0], { target: { value: '0x1234' } });

      if (specName === 'quip') {
        fireEvent.change(inputs[1], { target: { value: '0xabcd' } });
      }

      const button = await screen.findByRole('button', { name: 'Set Session Key' });

      await waitFor(() => expect(button.classList.contains('isDisabled')).toEqual(false));
      fireEvent.click(button);
      await waitFor(() => expect(queued?.accountId).toEqual(specName === 'quip' ? alice : bob));
    });
  }
});
