// Copyright 2017-2026 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

/// <reference types="@polkadot/dev-test/globals.d.ts" />

import type { ApiProps } from '@polkadot/react-hooks/ctx/types';
import type { SessionInfo } from './types.js';

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'styled-components';

import { lightTheme } from '@polkadot/react-components';
import i18next from '@polkadot/react-components/i18n';
import { ApiCtx } from '@polkadot/react-hooks/ctx/Api';
import { alice, bob, MemoryStore } from '@polkadot/test-support/keyring';
import { keyring } from '@polkadot/ui-keyring';
import { cryptoWaitReady } from '@polkadot/util-crypto';

import SessionKey from './SessionKey.js';

describe('shared + Validator and Session Key ownership input', () => {
  beforeAll(async () => {
    await cryptoWaitReady();
    await i18next.changeLanguage('en');

    if (keyring.getAccounts().length === 0) {
      keyring.loadAll({ isDevelopment: true, store: new MemoryStore() });
    }
  });

  afterEach(cleanup);

  for (const withSenders of [false, true]) {
    it(`passes proof and clears it on key and stash changes (${withSenders ? 'Session Key' : '+ Validator'})`, async () => {
      let latest: SessionInfo = {};
      const setKeys = jest.fn((keys: string, proof: string | Uint8Array) => ({ keys, proof }));
      const context = { api: { runtimeVersion: { specName: 'quip' }, tx: { session: { setKeys } } }, apiEndpoint: null, isEthereum: false, specName: 'quip', systemName: 'substrate' } as unknown as ApiProps;

      const onChange = jest.fn((info: SessionInfo): void => {
        latest = info;
      });

      const view = (stashId: string) => (
        <Suspense fallback='...'>
          <ThemeProvider theme={lightTheme}>
            <ApiCtx.Provider value={context}>
              <SessionKey
                controllerId={bob}
                onChange={onChange}
                stashId={stashId}
                withSenders={withSenders}
              />
            </ApiCtx.Provider>
          </ThemeProvider>
        </Suspense>
      );
      const { rerender } = render(view(alice));
      const [keysInput, proofInput] = await screen.findAllByPlaceholderText('0x...');

      fireEvent.change(keysInput, { target: { value: '0x1234' } });
      await waitFor(() => expect(latest.sessionTx).toEqual(null));
      fireEvent.change(proofInput, { target: { value: '0x' } });
      await waitFor(() => expect(latest.sessionTx).toEqual(null));
      fireEvent.change(proofInput, { target: { value: '0xabcd' } });
      await waitFor(() => expect(latest.sessionTx).toEqual({ keys: '0x1234', proof: '0xabcd' }));
      fireEvent.change(keysInput, { target: { value: '0x5678' } });
      await waitFor(() => expect(latest.sessionTx).toEqual(null));
      expect((proofInput as HTMLInputElement).value).toEqual('');
      fireEvent.change(proofInput, { target: { value: '0xbeef' } });
      await waitFor(() => expect(latest.sessionTx).toEqual({ keys: '0x5678', proof: '0xbeef' }));
      rerender(view(bob));
      await waitFor(() => expect(latest.sessionTx).toEqual(null));
      expect((proofInput as HTMLInputElement).value).toEqual('');
    });
  }

  it('keeps empty-proof setKeys working on other chains', async () => {
    let latest: SessionInfo = {};
    const setKeys = (keys: string, proof: Uint8Array) => ({ keys, proof });
    const context = { api: { runtimeVersion: { specName: 'polkadot' }, tx: { session: { setKeys } } } } as unknown as ApiProps;
    const onChange = jest.fn((info: SessionInfo): void => {
      latest = info;
    });

    render(
      <Suspense fallback='...'>
        <ThemeProvider theme={lightTheme}>
          <ApiCtx.Provider value={context}>
            <SessionKey
              controllerId={bob}
              onChange={onChange}
              stashId={alice}
            />
          </ApiCtx.Provider>
        </ThemeProvider>
      </Suspense>
    );
    fireEvent.change(await screen.findByPlaceholderText('0x...'), { target: { value: '0x1234' } });
    await waitFor(() => expect(latest.sessionTx).toEqual({ keys: '0x1234', proof: new Uint8Array() }));
    expect(screen.queryByText('Session key ownership proof')).toEqual(null);
  });
});
