// Copyright 2017-2026 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

/// <reference types="@polkadot/dev-test/globals.d.ts" />

import type { ApiProps } from '@polkadot/react-hooks/ctx/types';
import type { SortedTargets } from '../types.js';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'styled-components';

import { lightTheme } from '@polkadot/react-components';
import i18next from '@polkadot/react-components/i18n';
import { ApiCtx } from '@polkadot/react-hooks/ctx/Api';

import NewValidator from './NewValidator.js';

describe('+ Validator atomic onboarding', () => {
  beforeAll(async () => {
    await i18next.changeLanguage('en');
  });

  afterEach(cleanup);

  for (const [specName, batchAll, disabled] of [
    ['quip', false, true],
    ['quip', true, false],
    ['polkadot', false, false]
  ] as const) {
    it(`${specName} ${batchAll ? 'has' : 'lacks'} batchAll: form ${disabled ? 'disabled' : 'enabled'}`, async () => {
      const batch = jest.fn();
      const context = { api: { runtimeVersion: { specName }, tx: { utility: { batch, batchAll: batchAll ? batch : undefined } } } } as unknown as ApiProps;

      render(
        <Suspense fallback='...'>
          <ThemeProvider theme={lightTheme}>
            <ApiCtx.Provider value={context}>
              <NewValidator targets={{} as SortedTargets} />
            </ApiCtx.Provider>
          </ThemeProvider>
        </Suspense>
      );

      const button = await screen.findByRole('button', { name: 'Validator' });

      expect(button.classList.contains('isDisabled')).toEqual(disabled);

      if (disabled) {
        fireEvent.click(button);
      }

      expect(screen.queryByText('Setup Validator 1/2')).toEqual(null);
    });
  }
});
