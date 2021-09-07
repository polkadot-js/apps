// Copyright 2017-2021 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { fireEvent, screen, within } from '@testing-library/react';

import { MemoryStore } from '@polkadot/test-support/keyring';
import { keyring } from '@polkadot/ui-keyring';

import { AccountOverrides } from '../../test/hooks/default';
import { AccountsPage } from '../../test/pages/accountsPage';

const anAccount = (): AccountOverrides => ({});
const aliceAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
const bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';

describe('Sidebar, subs list', () => {
  let accountsPage: AccountsPage;

  beforeAll(() => {
    keyring.loadAll({ isDevelopment: true, store: new MemoryStore() });
  });
  beforeEach(() => {
    accountsPage = new AccountsPage();
  });

  it('dose not display subs when account has zero subs', async () => {
    accountsPage.renderPage([[aliceAddress, anAccount()]]);

    const accountRows = await accountsPage.findAccountRows();

    fireEvent.click(await within(accountRows[0].primaryRow).findByTestId('account-name'));

    const sidebar = await screen.findByTestId('sidebar');
    const identitySection = await within(sidebar).findByTestId('identity-section');

    const subs = within(identitySection).queryAllByText('sub');

    expect(subs).toHaveLength(0);
  });

  it('displays amount of subs', async () => {
    accountsPage.renderPage([[aliceAddress, anAccount()]], { subs: [bobAddress] });

    const accountRows = await accountsPage.findAccountRows();

    fireEvent.click(await within(accountRows[0].primaryRow).findByTestId('account-name'));
    const sidebar = await screen.findByTestId('sidebar');
    const identitySection = await within(sidebar).findByTestId('identity-section');

    const subs = within(identitySection).getByText('sub');

    expect(subs.parentElement).toHaveTextContent('sub1Show list');
  });

  it('opens a modal with subs list', async () => {
    accountsPage.renderPage([[aliceAddress, anAccount()]], { subs: [bobAddress] });

    const accountRows = await accountsPage.findAccountRows();

    fireEvent.click(await within(accountRows[0].primaryRow).findByTestId('account-name'));
    const sidebar = await screen.findByTestId('sidebar');
    const identitySection = await within(sidebar).findByTestId('identity-section');
    const showSubsButton = await within(identitySection).findByText('Show list');

    fireEvent.click(showSubsButton);

    const modal = await screen.findByTestId('modal');

    await within(modal).findByText('sub-identities');
    await within(modal).findByText('BOB');
  });

  it('displays picked sub in sidebar', async () => {
    accountsPage.renderPage([[aliceAddress, anAccount()], [bobAddress, { meta: { name: 'Bob' } }]], { subs: [bobAddress] });

    const accountRows = await accountsPage.findAccountRows();

    fireEvent.click(await within(accountRows[0].primaryRow).findByTestId('account-name'));
    const sidebar = await screen.findByTestId('sidebar');
    const identitySection = await within(sidebar).findByTestId('identity-section');
    const showSubsButton = await within(identitySection).findByText('Show list');

    fireEvent.click(showSubsButton);

    const modal = await screen.findByTestId('modal');

    const bob = await within(modal).findByTestId('account-name');

    expect(bob).toHaveTextContent('BOB');

    fireEvent.click(bob);

    expect(screen.queryAllByTestId('modal')).toHaveLength(0);

    const accountName = await within(sidebar).findByTestId('account-name');

    expect(accountName).toHaveTextContent('BOB');
  });

  it('closing modal does not change account in sidebar', async () => {
    accountsPage.renderPage([[aliceAddress, { meta: { name: 'Alice' } }], [bobAddress, { meta: { name: 'Bob' } }]], { subs: [bobAddress] });

    const accountRows = await accountsPage.findAccountRows();

    fireEvent.click(await within(accountRows[0].primaryRow).findByTestId('account-name'));
    const sidebar = await screen.findByTestId('sidebar');
    const identitySection = await within(sidebar).findByTestId('identity-section');
    const showSubsButton = await within(identitySection).findByText('Show list');

    fireEvent.click(showSubsButton);

    const modal = await screen.findByTestId('modal');

    const closeModal = await within(modal).findByTestId('close-modal');

    fireEvent.click(closeModal);

    expect(screen.queryAllByTestId('modal')).toHaveLength(0);

    const accountName = await within(sidebar).findByTestId('account-name');

    expect(accountName).toHaveTextContent('ALICE');
  });
});
