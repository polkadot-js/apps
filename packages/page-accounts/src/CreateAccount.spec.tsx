// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import AccountsApp from '@polkadot/app-accounts';
import { MemoryStore } from '@polkadot/app-accounts/test-support/MemoryStore';
import { Api } from '@polkadot/react-api';
import '@polkadot/react-components/i18n';
import { useApi } from '@polkadot/react-hooks';
import { fireEvent, render } from '@testing-library/react';
import React, { PropsWithChildren } from 'react';
import { MemoryRouter } from 'react-router-dom';

const SUBSTRATE_PORT = Number.parseInt(process.env.TEST_SUBSTRATE_PORT || '30333');

const WaitForApi = ({ children }: { children: React.ReactNode }): PropsWithChildren<any> | null => {
  const api = useApi();

  return api.isApiReady ? (children) : null;
};

const renderAccounts = () => {
  const memoryStore = new MemoryStore();

  return render(
    <MemoryRouter>
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
    </MemoryRouter>
  );
};

describe('--SLOW--: Account Create', () => {
  it('asks for confirmation after saving new account', async () => {
    const { findByPlaceholderText, findByTestId, findByText } = renderAccounts();

    const addAccountButton = await findByText('Add account', {}, { timeout: 4000 });

    fireEvent.click(addAccountButton);

    const nameInput = await findByPlaceholderText('new account');

    fireEvent.change(nameInput, { target: { value: 'my super account' } });

    const passwordInput = await findByTestId('password');

    fireEvent.change(passwordInput, { target: { value: 'a' } });

    const passwordRepeatInput = await findByTestId('password (repeat)');

    fireEvent.change(passwordRepeatInput, { target: { value: 'a' } });

    const saveButton = await findByText('Save');

    fireEvent.click(saveButton);

    expect(await findByText('Create and backup account')).toBeTruthy();
  });

  it('new create modal', async () => {
    const { findByTestId, findByText } = renderAccounts();

    const addAccountButton = await findByTestId('addAccount2');

    fireEvent.click(addAccountButton);

    const isSeedSavedCheckbox = await findByTestId('isSeedSaved-Checkbox');
    const hiddenCheckbox = isSeedSavedCheckbox as HTMLInputElement;

    fireEvent.click(hiddenCheckbox);

    const nextStepButton = await findByText('Next step', {}, { timeout: 4000 });

    fireEvent.click(nextStepButton);

    expect(await findByText('Add an account via seed 2/2')).toBeTruthy();

    const accountNameInput = await findByTestId('accountName');

    fireEvent.change(accountNameInput, { target: { value: 'name' } });

    const passwordInput = await findByTestId('password');

    fireEvent.change(passwordInput, { target: { value: 'password' } });

    const passwordInput2 = await findByTestId('password2');

    fireEvent.change(passwordInput2, { target: { value: 'password' } });

    const createAnAccountButton = await findByText('Create an account');

    fireEvent.click(createAnAccountButton);

    expect(await findByText('created account')).toBeTruthy();
  });
});
