// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import AccountsApp from '@polkadot/app-accounts';
import { Api } from '@polkadot/react-api';
import '@polkadot/react-components/i18n';
import { useApi } from '@polkadot/react-hooks';
import { KeyringJson, KeyringStore } from '@polkadot/ui-keyring/types';
import { fireEvent, render } from '@testing-library/react';
import React, { PropsWithChildren } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';

type AccountsMap = Record<string, KeyringJson>;

class MemoryStore implements KeyringStore {
  private accounts: AccountsMap = {};

  all (cb: (key: string, value: KeyringJson) => void): void {
    for (const accountsKey in this.accounts) {
      cb(accountsKey, this.accounts[accountsKey]);
    }
  }

  get (key: string, cb: (value: KeyringJson) => void): void {
    cb(this.accounts[key]);
  }

  remove (key: string, cb: (() => void) | undefined): void {
    delete this.accounts[key];

    if (cb) {
      cb();
    }
  }

  set (key: string, value: KeyringJson, cb: (() => void) | undefined): void {
    this.accounts[key] = value;

    if (cb) {
      cb();
    }
  }
}

const WaitForApi = ({ children }: { children: React.ReactNode }): PropsWithChildren<any> | null => {
  const api = useApi();

  return api.isApiReady ? (children) : null;
};

describe('Account Create', () => {
  let substrate: StartedTestContainer;

  beforeAll(async () => {
    substrate = await new GenericContainer('parity/substrate')
      .withExposedPorts(9944)
      .withCmd(['--dev', '--ws-port=9944', '--unsafe-ws-external'])
      .withWaitStrategy(Wait.forLogMessage('New epoch 0 launching'))
      .start();
  });

  afterAll(async () => {
    await substrate.stop();
  });

  it('works', async () => {
    jest.setTimeout(20000);
    const memoryStore = new MemoryStore();

    const { findByPlaceholderText, findByTestId, findByText } = render(
      <MemoryRouter>
        <Api store={memoryStore}
          url={`ws://127.0.0.1:${substrate.getMappedPort(9944)}`}>
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
});
