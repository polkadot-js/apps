// Copyright 2017-2021 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { fireEvent, screen, waitForElementToBeRemoved } from '@testing-library/react';

import i18next from '@polkadot/react-components/i18n';
import { MemoryStore } from '@polkadot/test-support/keyring';
import { keyring } from '@polkadot/ui-keyring';

import { AccountsPage } from '../../test/pages/accountsPage';

const spy = jest.spyOn(keyring, 'addUri');

const newAccountName = 'NEW ACCOUNT NAME';
const newAccountPassword = 'mySecretPassword';

describe('Create an account modal', () => {
  let accountsPage: AccountsPage;

  beforeAll(async () => {
    await i18next.changeLanguage('en');
    keyring.loadAll({ isDevelopment: true, store: new MemoryStore() });
  });
  beforeEach(() => {
    accountsPage = new AccountsPage();
  });

  it('creates an account', async () => {
    await accountsPage.enterCreateAccountModal();

    await screen.findByText('Add an account via seed 1/3');

    const firstStepNextButton = screen.getByRole('button', { name: 'Next' });

    expect(firstStepNextButton).toHaveClass('isDisabled');

    await fillFirstStep();

    expect(firstStepNextButton).not.toHaveClass('isDisabled');
    fireEvent.click(firstStepNextButton);

    await screen.findByText('Add an account via seed 2/3');
    const secondStepNextButton = screen.getByRole('button', { name: 'Next' });

    expect(secondStepNextButton).toHaveClass('isDisabled');
    fillSecondStep();
    expect(secondStepNextButton).not.toHaveClass('isDisabled');
    fireEvent.click(secondStepNextButton);

    await screen.findByText('Add an account via seed 3/3');

    const createAccountButton = screen.getByRole('button', { name: 'Save' });

    fireEvent.click(createAccountButton);

    await waitForElementToBeRemoved(() => screen.queryByText('Add an account via seed 3/3'));

    expectCreateAnAccountCall();
  });

  it('navigates through the modal flow with enter key', async () => {
    await accountsPage.enterCreateAccountModal();

    await screen.findByText('Add an account via seed 1/3');
    pressEnterKey();
    await screen.findByText('Add an account via seed 1/3');
    await fillFirstStep();
    pressEnterKey();
    await screen.findByText('Add an account via seed 2/3');
    fillSecondStep();
    pressEnterKey();
    await screen.findByText('Add an account via seed 3/3');
    pressEnterKey();
    expectCreateAnAccountCall();
  });

  it('gives an error message when entering invalid derivation path', async () => {
    await accountsPage.enterCreateAccountModal();

    const showAdvancedOptionsButton = await screen.findByText('Advanced creation options');

    fireEvent.click(showAdvancedOptionsButton);

    const derivationPathInput = await screen.findByTestId('secret derivation path');

    fireEvent.change(derivationPathInput, { target: { value: '//abc//' } });

    await screen.findByText('Unable to match provided value to a secret URI');
  });
});

function fillSecondStep () {
  const nameInput = screen.getByTestId('name');

  fireEvent.change(nameInput, { target: { value: newAccountName } });

  const passwordInput = screen.getByTestId('password');

  fireEvent.change(passwordInput, { target: { value: newAccountPassword } });

  const passwordRepeatInput = screen.getByTestId('password (repeat)');

  fireEvent.change(passwordRepeatInput, { target: { value: newAccountPassword } });
}

async function fillFirstStep () {
  const checkbox = await screen.findByText('I have saved my mnemonic seed safely');

  fireEvent.click(checkbox);
}

function pressEnterKey () {
  fireEvent.keyDown(window, {
    code: 'Enter',
    key: 'Enter'
  });
}

function expectCreateAnAccountCall () {
  expect(spy).toBeCalledWith(
    expect.anything(),
    newAccountPassword,
    expect.objectContaining({
      name: newAccountName
    }),
    'sr25519'
  );
}
