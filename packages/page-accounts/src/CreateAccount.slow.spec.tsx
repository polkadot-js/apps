// Copyright 2017-2022 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import '@polkadot/react-components/i18n';

import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import AccountsApp from '@polkadot/app-accounts';
import { lightTheme } from '@polkadot/apps/themes';
import { Api } from '@polkadot/react-api';
import { MemoryStore } from '@polkadot/test-support/keyring';
import { WaitForApi } from '@polkadot/test-support/react';
import { SUBSTRATE_PORT } from '@polkadot/test-support/substrate';

function noop (): void {
  // do nothing
}

const renderAccounts = () => {
  const memoryStore = new MemoryStore();

  return render(
    <MemoryRouter>
      <ThemeProvider theme={lightTheme}>
        <Api
          apiUrl={`ws://127.0.0.1:${SUBSTRATE_PORT}`}
          isElectron={false}
          store={memoryStore}
        >
          <WaitForApi>
            <div>
              <AccountsApp
                basePath='/accounts'
                onStatusChange={noop}
              />
            </div>
          </WaitForApi>
        </Api>
      </ThemeProvider>
    </MemoryRouter>
  );
};

describe('--SLOW--: Account Create', () => {
  it('created account is added to list', async () => {
    const { findByTestId, findByText, queryByText } = renderAccounts();

    const addAccountButton = await findByText('Add account', {});

    fireEvent.click(addAccountButton);

    const isSeedSavedCheckbox = await findByText('I have saved my mnemonic seed safely');
    const hiddenCheckbox = isSeedSavedCheckbox as HTMLInputElement;

    fireEvent.click(hiddenCheckbox);

    const nextStepButton = await findByText('Next', {});

    fireEvent.click(nextStepButton);

    const accountNameInput = await findByTestId('name');

    fireEvent.change(accountNameInput, { target: { value: 'my new account' } });

    const passwordInput = await findByTestId('password');

    fireEvent.change(passwordInput, { target: { value: 'password' } });

    const passwordInput2 = await findByTestId('password (repeat)');

    fireEvent.change(passwordInput2, { target: { value: 'password' } });

    const toStep3Button = await findByText('Next', {});

    fireEvent.click(toStep3Button);

    const createAnAccountButton = await findByText('Save', {});

    fireEvent.click(createAnAccountButton);

    await waitForElementToBeRemoved(() => queryByText('Add an account via seed 3/3'));

    expect(await findByText('MY NEW ACCOUNT')).toBeTruthy();
  });

  it('gives an error message when entering invalid derivation path', async () => {
    const { findByTestId, findByText } = renderAccounts();

    const addAccountButton = await findByText('Add account', {});

    fireEvent.click(addAccountButton);

    const showAdvancedOptionsButton = await findByText('Advanced creation options', {});

    fireEvent.click(showAdvancedOptionsButton);

    const derivationPathInput = await findByTestId('secret derivation path', {});

    fireEvent.change(derivationPathInput, { target: { value: '//abc//' } });

    const errorMsg = await findByText('Unable to match provided value to a secret URI', {});

    expect(errorMsg).toBeTruthy();
  });
});
