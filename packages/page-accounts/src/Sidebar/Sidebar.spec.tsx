// Copyright 2017-2021 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { fireEvent, screen, waitFor, within } from '@testing-library/react';

import { AddressFlags } from '@polkadot/react-hooks/types';
import { anAccount, anAccountWithInfo, anAccountWithMeta } from '@polkadot/test-support/creation/account';
import { alice, bob, MemoryStore } from '@polkadot/test-support/keyring';
import { Sidebar } from '@polkadot/test-support/pagesElements/Sidebar';
import { mockApiHooks } from '@polkadot/test-support/utils/mockApiHooks';
import { keyring } from '@polkadot/ui-keyring';

import { AccountRow } from '../../test/pageElements/AccountRow';
import { AccountsPage } from '../../test/pages/accountsPage';

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
    accountsPage = new AccountsPage();
    accountsPage.clearAccounts();
  });

  describe('editing', () => {
    const initialName = 'INITIAL_NAME';
    const newName = 'NEW_NAME';
    const defaultTag = 'Default';
    const nameInputNotFoundError = 'Unable to find an element by: [data-testid="name-input"]';

    describe('changes name', () => {
      beforeEach(async () => {
        accountsPage.render([[alice, anAccountWithMeta({ isDevelopment: false, name: initialName })]]);
        accountRows = await accountsPage.getAccountRows();
        sideBar = await accountRows[0].openSidebar();
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
      accountsPage.renderDefaultAccounts(1);
      accountRows = await accountsPage.getAccountRows();
      sideBar = await accountRows[0].openSidebar();
      await sideBar.clickByText('no tags');
      expect(sideBar.queryByRole('combobox')).toBeFalsy();

      await expect(sideBar.typeAccountName(newName)).rejects.toThrowError(nameInputNotFoundError);
    });

    it('when isEditable is false account name is not editable', async () => {
      accountsPage.renderAccountsWithDefaultAddresses(
        anAccountWithInfo({ flags: { isEditable: false } as AddressFlags })
      );
      accountRows = await accountsPage.getAccountRows();
      sideBar = await accountRows[0].openSidebar();
      sideBar.edit();

      await expect(sideBar.typeAccountName(newName)).rejects.toThrowError(nameInputNotFoundError);
    });

    describe('on edit cancel', () => {
      beforeEach(async () => {
        accountsPage.render([[alice, anAccountWithMeta({ isDevelopment: false, name: initialName, tags: [] })]]);
        accountRows = await accountsPage.getAccountRows();
        sideBar = await accountRows[0].openSidebar();

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

        accountRows = await accountsPage.getAccountRows();
        sideBar = await accountRows[0].openSidebar();
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

        sideBar = await accountRows[1].openSidebar();
        await sideBar.assertAccountName('BOB');
      });
    });
  });

  describe('identity section', () => {
    it('does not display subs when account has zero subs', async () => {
      accountsPage.render([[alice, anAccount()]]);
      accountRows = await accountsPage.getAccountRows();
      sideBar = await accountRows[0].openSidebar();
      const subs = await sideBar.findSubs();

      expect(subs).toHaveLength(0);
    });

    it('displays count of subs and account names', async () => {
      mockApiHooks.setSubs([bob]);
      accountsPage.render([[alice, anAccount()], [bob, anAccountWithMeta({ name: 'Bob' })]]);
      accountRows = await accountsPage.getAccountRows();
      sideBar = await accountRows[0].openSidebar();
      const subs = await sideBar.findSubs();

      const subsNumber = subs[0].childNodes[0];
      const subAccount = subs[0].childNodes[1];

      expect(subsNumber).toHaveClass('subs-number');
      expect(subsNumber).toHaveTextContent('1');
      expect(subAccount).toHaveTextContent('BOB');
    });

    it('displays picked sub in sidebar', async () => {
      mockApiHooks.setSubs([bob]);
      accountsPage.render([[alice, anAccount()], [bob, anAccountWithMeta({ name: 'Bob' })]]);
      accountRows = await accountsPage.getAccountRows();
      sideBar = await accountRows[0].openSidebar();
      const subs = await sideBar.findSubs();
      const subAccount = subs[0].childNodes[1];

      fireEvent.click(await within(subAccount as HTMLElement).findByTestId('account-name'));

      await sideBar.assertAccountName('BOB');
    });
  });
});
