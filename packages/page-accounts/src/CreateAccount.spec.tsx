// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import AccountsApp from '@polkadot/app-accounts';
import { MemoryStore } from '@polkadot/app-accounts/test-support/MemoryStore';
import { lightTheme } from '@polkadot/apps/themes';
import { Api } from '@polkadot/react-api';
import '@polkadot/react-components/i18n';
import { useApi } from '@polkadot/react-hooks';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import React, { PropsWithChildren } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

const SUBSTRATE_PORT = Number.parseInt(process.env.TEST_SUBSTRATE_PORT || '30333');

const WaitForApi = ({ children }: { children: React.ReactNode }): PropsWithChildren<any> | null => {
  const api = useApi();

  return api.isApiReady ? (children) : null;
};

const renderAccounts = () => {
  const memoryStore = new MemoryStore();

  return render(
    <MemoryRouter>
      <ThemeProvider theme={lightTheme}>
        <Api store={memoryStore}
          url={`ws://127.0.0.1:${SUBSTRATE_PORT}`}>
          <WaitForApi>
            <div>
              <AccountsApp basePath='/accounts'
                onStatusChange={() => { /* */
                }}/>
            </div>
          </WaitForApi>
        </Api>
      </ThemeProvider>
    </MemoryRouter>
  );
};

describe.only('--SLOW--: Account Create', () => {
  it('new create modal', async () => {
    const { findByTestId, findByText, queryByText } = renderAccounts();

    const addAccountButton = await findByText('Add account', {}, { timeout: 5000 });

    fireEvent.click(addAccountButton);

    const isSeedSavedCheckbox = await findByText('I have saved my mnemonic seed safely');
    const hiddenCheckbox = isSeedSavedCheckbox as HTMLInputElement;

    fireEvent.click(hiddenCheckbox);

    const nextStepButton = await findByText('Next', {}, { timeout: 4000 });

    fireEvent.click(nextStepButton);

    const accountNameInput = await findByTestId('name');

    fireEvent.change(accountNameInput, { target: { value: 'my new account' } });

    const passwordInput = await findByTestId('password');

    fireEvent.change(passwordInput, { target: { value: 'password' } });

    const passwordInput2 = await findByTestId('password (repeat)');

    fireEvent.change(passwordInput2, { target: { value: 'password' } });

    const toStep3Button = await findByText('Next', {}, { timeout: 4000 });

    fireEvent.click(toStep3Button);

    const createAnAccountButton = await findByText('Save', {}, { timeout: 4000 });

    fireEvent.click(createAnAccountButton);

    await waitForElementToBeRemoved(() => queryByText('Add an account via seed 3/3'));

    expect(await findByText('MY NEW ACCOUNT')).toBeTruthy();
  });

  it('error message for derivation path', async () => {
    const { findByTestId, findByText } = renderAccounts();

    const addAccountButton = await findByText('Add account', {}, { timeout: 5000 });

    fireEvent.click(addAccountButton);

    const showAdvancedOptionsButton = await findByText('Advanced creation options', {}, { timeout: 5000 });

    fireEvent.click(showAdvancedOptionsButton);

    const derivationPathInput = await findByTestId('secret derivation path', {}, { timeout: 5000 });

    fireEvent.change(derivationPathInput, { target: { value: '//abc//' } });

    const errorMsg = await findByText('Unable to match provided value to a secret URI', {}, { timeout: 5000 });

    expect(errorMsg).toBeTruthy();
  });
});
