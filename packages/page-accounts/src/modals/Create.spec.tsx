// Copyright 2017-2025 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

/// <reference types="@polkadot/dev-test/globals.d.ts" />

import { fireEvent, screen, waitForElementToBeRemoved } from '@testing-library/react';

import i18next from '@polkadot/react-components/i18n';
import { MemoryStore } from '@polkadot/test-support/keyring';
import { assertButtonDisabled, assertText, clickButton, fillInput } from '@polkadot/test-support/utils';
import { keyring } from '@polkadot/ui-keyring';
import { cryptoWaitReady } from '@polkadot/util-crypto';

import { AccountsPage } from '../../test/pages/accountsPage.js';

const spy = jest.spyOn(keyring, 'addUri');

const newAccountName = 'NEW ACCOUNT NAME';
const newAccountPassword = 'mySecretPassword';

describe('Create an account modal', () => {
  let accountsPage: AccountsPage;

  beforeAll(async () => {
    await cryptoWaitReady();
    await i18next.changeLanguage('en');

    if (keyring.getAccounts().length === 0) {
      keyring.loadAll({ isDevelopment: true, store: new MemoryStore() });
    }
  });
  beforeEach(() => {
    accountsPage = new AccountsPage();
  });

  // eslint-disable-next-line jest/expect-expect
  it('creates an account', async () => {
    await accountsPage.enterCreateAccountModal();

    assertButtonDisabled('Next');
    await fillFirstStep();
    await clickButton('Next');

    await expectSecondStep();
    assertButtonDisabled('Next');
    fillSecondStep();
    await clickButton('Next');

    await expectThirdStep();
    await clickButton('Save');

    await waitForElementToBeRemoved(() => screen.queryByText('Add an account via seed 3/3'));
    expectCreateAnAccountCall();
  });

  // eslint-disable-next-line jest/expect-expect
  it('navigates through the modal flow with enter key', async () => {
    await accountsPage.enterCreateAccountModal();

    assertButtonDisabled('Next');
    pressEnterKey();
    await expectFirstStep();
    await fillFirstStep();
    pressEnterKey();

    await expectSecondStep();
    fillSecondStep();
    pressEnterKey();

    await expectThirdStep();
    pressEnterKey();

    await waitForElementToBeRemoved(() => screen.queryByText('Add an account via seed 3/3'));
    expectCreateAnAccountCall();
  });

  // eslint-disable-next-line jest/expect-expect
  it('gives an error message when entering invalid derivation path', async () => {
    await accountsPage.enterCreateAccountModal();

    const showAdvancedOptionsButton = await screen.findByText('Advanced creation options');

    fireEvent.click(showAdvancedOptionsButton);

    fillInput('secret derivation path', '//abc//');

    await assertText('Unable to match provided value to a secret URI');
  });
});

function fillSecondStep () {
  fillInput('name', newAccountName);
  fillInput('password', newAccountPassword);
  fillInput('password (repeat)', newAccountPassword);
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
  expect(spy).toHaveBeenCalledWith(
    expect.anything(),
    newAccountPassword,
    expect.objectContaining({
      name: newAccountName
    }),
    'sr25519'
  );
}

async function expectFirstStep () {
  await screen.findByText('Add an account via seed 1/3');
}

async function expectSecondStep () {
  await screen.findByText('Add an account via seed 2/3');
}

async function expectThirdStep () {
  await screen.findByText('Add an account via seed 3/3');
}
