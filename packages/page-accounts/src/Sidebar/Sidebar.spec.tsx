// Copyright 2017-2021 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { fireEvent, screen, waitFor, within } from '@testing-library/react';

import { AddressFlags, UseAccountInfo } from '@polkadot/react-hooks/types';
import { alice, bob, defaultAddresses, MemoryStore } from '@polkadot/test-support/keyring';
import { keyring } from '@polkadot/ui-keyring';
import { KeyringJson$Meta } from '@polkadot/ui-keyring/types';

import { AccountOverrides, Override } from '../../test/hooks/default';
import { AccountRow } from '../../test/pageElements/AccountRow';
import { Sidebar } from '../../test/pageElements/Sidebar';
import { AccountsPage } from '../../test/pages/accountsPage';

const anAccount = (): AccountOverrides => ({});

describe('Sidebar', () => {
  let accountsPage: AccountsPage;

  beforeAll(() => {
    if (keyring.getAccounts().length === 0) {
      keyring.loadAll({ isDevelopment: true, store: new MemoryStore() });
    }
  });

  beforeEach(() => {
    defaultAddresses.forEach((address) => keyring.forgetAccount(address));
    accountsPage = new AccountsPage();
  });

  describe('sidebar editing', () => {
    const initialName = 'INITIAL_NAME';
    const newName = 'NEW_NAME';
    const defaultTag = 'Default';
    const nameInputNotFoundError = 'Unable to find an element by: [data-testid="name-input"]';

    let accountRows: AccountRow[];
    let sideBar: Sidebar;

    describe('changes name', () => {
      beforeEach(async () => {
        accountsPage.renderPage([[alice, anAccountWithMeta({ isDevelopment: false, name: initialName })]]);
        sideBar = await openSidebarForAccountRow(0);
        await sideBar.changeAccountName(newName);
      });

      it('within keyring', () => {
        const changedAccount = keyring.getAccount(alice);

        expect(changedAccount?.meta?.name).toEqual(newName);
      });

      it('within sidebar', async () => {
        await sideBar.assertAccountName(newName);
      });

      it('within account row', async () => {
        await accountRows[0].assertAccountName(newName);
      });
    });

    it('cannot be edited if edit button has not been pressed', async () => {
      await sideBar.clickByText('no tags');
      expect(sideBar.queryByRole('combobox')).toBeFalsy();

      await expect(sideBar.typeAccountName(newName)).rejects.toThrowError(nameInputNotFoundError);
    });

    it('when isEditable is false account name is not editable', async () => {
      accountsPage.renderAccountsWithDefaultAddresses(
        anAccountWithInfo({ flags: { isEditable: false } as AddressFlags })
      );
      sideBar = await openSidebarForAccountRow(0);
      sideBar.edit();
      await expect(sideBar.typeAccountName(newName)).rejects.toThrowError(nameInputNotFoundError);
    });

    describe('on edit cancel', () => {
      beforeEach(async () => {
        accountsPage.renderPage([[alice, anAccountWithMeta({ isDevelopment: false, name: initialName, tags: [] })]]);

        sideBar = await openSidebarForAccountRow(0);
        await sideBar.assertTags('no tags');
        sideBar.edit();
      });

      it('restores tags and name to state from keyring', async () => {
        await sideBar.typeAccountName(newName);
        await sideBar.selectTag(defaultTag);

        sideBar.cancel();
        await sideBar.assertTags('no tags');
        await sideBar.assertAccountName(initialName);
      });

      it('Cancel button disappears', () => {
        sideBar.cancel();
        expect(sideBar.queryByRole('button', { name: 'Cancel' })).toBeFalsy();
      });
    });

    describe('outside click', () => {
      beforeEach(async () => {
        accountsPage.renderAccountsWithDefaultAddresses(
          anAccountWithMeta({ name: 'alice' }),
          anAccountWithMeta({ name: 'bob' })
        );

        sideBar = await openSidebarForAccountRow(0);
        sideBar.edit();
      });

      it('cancels editing', async () => {
        await sideBar.typeAccountName(newName);
        await sideBar.selectTag(defaultTag);

        fireEvent.click(await screen.findByText('accounts'));

        await sideBar.assertTags('no tags');
        await sideBar.assertAccountName('ALICE');

        expect(sideBar.queryByRole('button', { name: 'Cancel' })).toBeFalsy();
      });

      it('within sidebar does not cancel editing', async () => {
        await sideBar.clickByText('Tags');

        expect(sideBar.queryByRole('button', { name: 'Cancel' })).toBeTruthy();
      });

      it('cancels editing and changes name when opening sidebar for another account', async () => {
        await waitFor(() => sideBar.assertAccountInput('alice'));

        sideBar = await openSidebarForAccountRow(1);
        await sideBar.assertAccountName('BOB');
      });
    });

    async function openSidebarForAccountRow (rowIndex: number) {
      accountRows = await accountsPage.findAccountRows();

      return accountRows[rowIndex].openSidebar();
    }
  });

  describe('identity section', () => {
    it('dose not display subs when account has zero subs', async () => {
      accountsPage.renderPage([[alice, anAccount()]]);

      const accountRows = await accountsPage.findAccountRows();

      fireEvent.click(await within(accountRows[0].primaryRow).findByTestId('account-name'));

      const sidebar = await screen.findByTestId('account-sidebar');
      const identitySection = await within(sidebar).findByTestId('identity-section');

      const subs = within(identitySection).queryAllByText('sub');

      expect(subs).toHaveLength(0);
    });

    it('displays count of subs', async () => {
      accountsPage.renderPage([[alice, anAccount()], [bob, { meta: { name: 'Bob' } }]], { subs: [bob] });

      const accountRows = await accountsPage.findAccountRows();

      fireEvent.click(await within(accountRows[0].primaryRow).findByTestId('account-name'));
      const sidebar = await screen.findByTestId('account-sidebar');
      const identitySection = await within(sidebar).findByTestId('identity-section');

      const subs = within(identitySection).getByText('sub');

      expect(subs.parentElement).toHaveTextContent('sub1Show list');
    });

    it('opens a modal with subs list', async () => {
      accountsPage.renderPage([[alice, anAccount()], [bob, { meta: { name: 'Bob' } }]], { subs: [bob] });

      const accountRows = await accountsPage.findAccountRows();

      fireEvent.click(await within(accountRows[0].primaryRow).findByTestId('account-name'));
      const sidebar = await screen.findByTestId('account-sidebar');
      const identitySection = await within(sidebar).findByTestId('identity-section');
      const showSubsButton = await within(identitySection).findByText('Show list');

      fireEvent.click(showSubsButton);

      const modal = await screen.findByTestId('modal');

      await within(modal).findByText('sub-identities');
      await within(modal).findByText('BOB');
    });

    it('displays picked sub in sidebar', async () => {
      accountsPage.renderPage([[alice, anAccount()], [bob, { meta: { name: 'Bob' } }]], { subs: [bob] });

      const accountRows = await accountsPage.findAccountRows();

      fireEvent.click(await within(accountRows[0].primaryRow).findByTestId('account-name'));
      const sidebar = await screen.findByTestId('account-sidebar');
      const identitySection = await within(sidebar).findByTestId('identity-section');
      const showSubsButton = await within(identitySection).findByText('Show list');

      fireEvent.click(showSubsButton);

      const modal = await screen.findByTestId('modal');

      const bobAccountName = await within(modal).findByTestId('account-name');

      expect(bobAccountName).toHaveTextContent('BOB');

      fireEvent.click(bobAccountName);

      expect(screen.queryAllByTestId('modal')).toHaveLength(0);

      const accountName = await within(sidebar).findByTestId('account-name');

      expect(accountName).toHaveTextContent('BOB');
    });

    it('closing modal does not change account in sidebar', async () => {
      accountsPage.renderPage([[alice, { meta: { name: 'Alice' } }], [bob, { meta: { name: 'Bob' } }]], { subs: [bob] });

      const accountRows = await accountsPage.findAccountRows();

      fireEvent.click(await within(accountRows[0].primaryRow).findByTestId('account-name'));
      const sidebar = await screen.findByTestId('account-sidebar');
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
});

const anAccountWithMeta = (meta: Override<KeyringJson$Meta>) => ({
  meta
});

const anAccountWithInfo = (info: Override<UseAccountInfo>) => ({
  info
});
