// Copyright 2017-2021 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { fireEvent, screen, waitFor, within } from '@testing-library/react';

import { AddressFlags } from '@polkadot/react-hooks/types';
import { alice, bob, defaultAddresses, MemoryStore } from '@polkadot/test-support/keyring';
import { keyring } from '@polkadot/ui-keyring';

import { AccountRow } from '../../test/pageElements/AccountRow';
import { Sidebar } from '../../test/pageElements/Sidebar';
import { AccountsPage } from '../../test/pages/accountsPage';
import { anAccount, anAccountWithInfo, anAccountWithMeta } from '../../test/utils/account';

describe('Sidebar', () => {
  let accountsPage: AccountsPage;
  let accountRows: AccountRow[];
  let sideBar: Sidebar;

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
  });

  describe('identity section', () => {
    it('dose not display subs when account has zero subs', async () => {
      accountsPage.renderPage([[alice, anAccount()]]);
      sideBar = await openSidebarForAccountRow(0);
      const subs = await sideBar.findSubs();

      expect(subs).toHaveLength(0);
    });

    it('displays count of subs', async () => {
      accountsPage.renderPage([[alice, anAccount()], [bob, { meta: { name: 'Bob' } }]], { subs: [bob] });
      sideBar = await openSidebarForAccountRow(0);
      const subs = await sideBar.findSubs();

      expect(subs[0].parentElement).toHaveTextContent('sub1Show list');
    });

    it('opens a modal with subs list', async () => {
      accountsPage.renderPage([[alice, anAccount()], [bob, { meta: { name: 'Bob' } }]], { subs: [bob] });
      sideBar = await openSidebarForAccountRow(0);
      const modal = await sideBar.openSubsModal();

      await within(modal).findByText('sub-identities');
      await within(modal).findByText('BOB');
    });

    it('displays picked sub in sidebar', async () => {
      accountsPage.renderPage([[alice, anAccount()], [bob, { meta: { name: 'Bob' } }]], { subs: [bob] });
      sideBar = await openSidebarForAccountRow(0);
      const modal = await sideBar.openSubsModal();

      const bobAccountName = await within(modal).findByTestId('account-name');

      expect(bobAccountName).toHaveTextContent('BOB');

      fireEvent.click(bobAccountName);

      assertModalClosed();
      await sideBar.assertAccountName('BOB');
    });

    it('closing modal does not change account in sidebar', async () => {
      accountsPage.renderPage([[alice, { meta: { name: 'Alice' } }], [bob, { meta: { name: 'Bob' } }]], { subs: [bob] });
      sideBar = await openSidebarForAccountRow(0);
      const modal = await sideBar.openSubsModal();

      const closeModal = await within(modal).findByTestId('close-modal');

      fireEvent.click(closeModal);

      assertModalClosed();
      await sideBar.assertAccountName('ALICE');
    });
  });

  async function openSidebarForAccountRow (rowIndex: number) {
    accountRows = await accountsPage.findAccountRows();

    return accountRows[rowIndex].openSidebar();
  }
});

function assertModalClosed () {
  expect(screen.queryAllByTestId('modal')).toHaveLength(0);
}
