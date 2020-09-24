// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import AccountsApp from '@polkadot/app-accounts';
import { MemoryStore } from '@polkadot/app-accounts/test-support/MemoryStore';
import { Api } from '@polkadot/react-api';
import '@polkadot/react-components/i18n';
import { useApi } from '@polkadot/react-hooks';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
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
  it('new create modal', async () => {
    const { findByTestId, findByText, queryByText } = renderAccounts();

    const addAccountButton = await findByText('Add account', {}, { timeout: 5000 });

    fireEvent.click(addAccountButton);

    const isSeedSavedCheckbox = await findByTestId('checkbox');
    const hiddenCheckbox = isSeedSavedCheckbox as HTMLInputElement;

    fireEvent.click(hiddenCheckbox);

    const nextStepButton = await findByText('Next step', {}, { timeout: 4000 });

    fireEvent.click(nextStepButton);

    expect(await findByText('Add an account via seed 2/3')).toBeTruthy();

    const accountNameInput = await findByTestId('A descriptive name for your account');

    fireEvent.change(accountNameInput, { target: { value: 'my new account' } });

    const passwordInput = await findByTestId('A new password for this account');

    fireEvent.change(passwordInput, { target: { value: 'password' } });

    const passwordInput2 = await findByTestId('Repeat password for verification');

    fireEvent.change(passwordInput2, { target: { value: 'password' } });

    const toStep3Button = await findByText('Next step', {}, { timeout: 4000 });

    fireEvent.click(toStep3Button);

    expect(await findByText('Add an account via seed 3/3')).toBeTruthy();

    const createAnAccountButton = await findByText('Create an account', {}, { timeout: 4000 });

    fireEvent.click(createAnAccountButton);

    await waitForElementToBeRemoved(() => queryByText('Add an account via seed 3/3'));

    expect(await findByText('MY NEW ACCOUNT')).toBeTruthy();
  });
});
