// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

/// <reference types="@polkadot/dev-test/globals.d.ts" />

import type { AddressFlags } from '@polkadot/react-hooks/types';
import type { Sidebar } from '@polkadot/test-support/pagesElements';
import type { RegistrationJudgement } from '@polkadot/types/interfaces';

import { fireEvent, screen, waitFor, within } from '@testing-library/react';

import i18next from '@polkadot/react-components/i18n';
import { anAccount, anAccountWithInfo, anAccountWithMeta } from '@polkadot/test-support/creation/account';
import { alice, bob, MemoryStore } from '@polkadot/test-support/keyring';
import { charlieShortAddress, ferdieShortAddress, mockRegistration, registrars } from '@polkadot/test-support/mockData';
import { mockApiHooks } from '@polkadot/test-support/utils';
import { keyring } from '@polkadot/ui-keyring';

import { AccountsPage } from '../../../page-accounts/test/pages/accountsPage.js';

// FIXME: these all need to be wrapped in waitFor ....
// eslint-disable-next-line jest/no-disabled-tests
describe.skip('Sidebar', () => {
  let accountsPage: AccountsPage;
  let sideBar: Sidebar;

  beforeAll(async () => {
    await i18next.changeLanguage('en');

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
        // Cannot get this to work on React 18 ... the first one fails :(
        // However... with a delay, it seems to get through the queue
        accountsPage.render([[alice, anAccountWithMeta({ isDevelopment: false, name: initialName })]]);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        sideBar = await accountsPage.openSidebarForRow(0);

        await sideBar.changeAccountName(newName);
      });

      it('within keyring', () => {
        const changedAccount = keyring.getAccount(alice);

        expect(changedAccount?.meta?.name).toEqual(newName);
      });

      // eslint-disable-next-line jest/expect-expect
      it('within sidebar', async () => {
        await sideBar.assertAccountName(newName);
      });

      // eslint-disable-next-line jest/expect-expect
      it('within account row', async () => {
        const accountRows = await accountsPage.getAccountRows();

        await accountRows[0].assertAccountName(newName);
      });
    });

    it('cannot be edited if edit button has not been pressed', async () => {
      accountsPage.renderDefaultAccounts(1);
      sideBar = await accountsPage.openSidebarForRow(0);
      await sideBar.clickByText('none');
      expect(sideBar.queryByRole('combobox')).toBeFalsy();

      await expect(sideBar.typeAccountName(newName)).rejects.toThrow(nameInputNotFoundError);
    });

    it('when isEditable is false account name is not editable', async () => {
      accountsPage.renderAccountsWithDefaultAddresses(
        anAccountWithInfo({ flags: { isEditable: false } as AddressFlags })
      );
      sideBar = await accountsPage.openSidebarForRow(0);
      sideBar.edit();

      await expect(sideBar.typeAccountName(newName)).rejects.toThrow(nameInputNotFoundError);
    });

    describe('on edit cancel', () => {
      beforeEach(async () => {
        accountsPage.renderAccountsWithDefaultAddresses(
          anAccountWithMeta({ isDevelopment: false, name: initialName, tags: [] })
        );
        sideBar = await accountsPage.openSidebarForRow(0);

        await sideBar.assertTags('none');
        sideBar.edit();
      });

      // eslint-disable-next-line jest/expect-expect
      it('restores tags and name to state from keyring', async () => {
        await sideBar.typeAccountName(newName);
        await sideBar.selectTag(defaultTag);

        sideBar.cancel();
        await sideBar.assertTags('none');
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
        sideBar = await accountsPage.openSidebarForRow(0);
        sideBar.edit();
      });

      it('cancels editing', async () => {
        await sideBar.typeAccountName(newName);
        await sideBar.selectTag(defaultTag);

        fireEvent.click(await screen.findByText('accounts'));

        await sideBar.assertTags('none');
        await sideBar.assertAccountName('ALICE');

        expect(sideBar.queryByRole('button', { name: 'Cancel' })).toBeFalsy();
      });

      it('within sidebar does not cancel editing', async () => {
        await sideBar.clickByText('Tags');

        expect(sideBar.queryByRole('button', { name: 'Cancel' })).toBeTruthy();
      });

      // eslint-disable-next-line jest/expect-expect
      it('cancels editing and changes name when opening sidebar for another account', async () => {
        await waitFor(() => sideBar.assertAccountInput('alice'));

        sideBar = await accountsPage.openSidebarForRow(1);
        await sideBar.assertAccountName('BOB');
      });
    });
  });

  describe('identity section', () => {
    describe('subs', () => {
      describe('when do not exist', () => {
        it('does not display subs', async () => {
          accountsPage.renderDefaultAccounts(1);
          sideBar = await accountsPage.openSidebarForRow(0);
          const subs = await sideBar.findSubs();

          expect(subs).toHaveLength(0);
        });
      });

      describe('when exist', () => {
        let subs: HTMLElement[];

        beforeEach(async () => {
          mockApiHooks.setSubs([bob]);
          accountsPage.renderAccountsWithDefaultAddresses(
            anAccount(),
            anAccountWithMeta({ name: 'Bob' })
          );
          sideBar = await accountsPage.openSidebarForRow(0);
          subs = await sideBar.findSubs();
        });

        it('displays count of subs and account names', () => {
          const subsNumber = subs[0].childNodes[0];
          const subAccount = subs[0].childNodes[1];

          expect(subsNumber).toHaveClass('subs-number');
          expect(subsNumber).toHaveTextContent('1');
          expect(subAccount).toHaveTextContent('BOB');
        });

        // eslint-disable-next-line jest/expect-expect
        it('displays picked sub in sidebar', async () => {
          const subAccount = subs[0].childNodes[1];

          fireEvent.click(await within(subAccount as HTMLElement).findByTestId('account-name'));

          await sideBar.assertAccountName('BOB');
        });
      });
    });

    describe('judgements', () => {
      // eslint-disable-next-line jest/expect-expect
      it('displays several judgements', async () => {
        mockApiHooks.setJudgements(mockRegistration.judgements as RegistrationJudgement[]);
        accountsPage.renderDefaultAccounts(1);
        sideBar = await accountsPage.openSidebarForRow(0);

        await sideBar.assertJudgement('1 Known good');
        await sideBar.assertJudgement('2 Reasonable');
        await sideBar.assertJudgement('1 Erroneous');
      });

      // eslint-disable-next-line jest/expect-expect
      it('displays no judgements', async () => {
        accountsPage.renderDefaultAccounts(1);
        sideBar = await accountsPage.openSidebarForRow(0);

        await sideBar.assertJudgement('No judgements');
      });

      describe('displays registrars', () => {
        beforeEach(async () => {
          mockApiHooks.setJudgements(mockRegistration.judgements as RegistrationJudgement[]);
          mockApiHooks.setRegistrars(registrars);
          accountsPage.render([
            [alice, anAccountWithMeta({ name: 'Alice' })],
            [bob, anAccountWithMeta({ name: 'Bob' })]
          ]);
          sideBar = await accountsPage.openSidebarForRow(0);
        });

        // eslint-disable-next-line jest/expect-expect
        it('singular registrar', async () => {
          const judgementTag = await sideBar.getJudgement('1 Known good');

          await judgementTag.assertRegistrars([charlieShortAddress]);
        });

        // eslint-disable-next-line jest/expect-expect
        it('multiple registrars', async () => {
          const judgementTag = await sideBar.getJudgement('2 Reasonable');

          await judgementTag.assertRegistrars(['BOB', ferdieShortAddress]);
        });

        it('opens clicked registrar in sidebar and closes popup', async () => {
          const judgementTag = await sideBar.getJudgement('2 Reasonable');

          await judgementTag.clickRegistrar('BOB');

          expect(screen.queryByTestId('popup-window')).toBeFalsy();

          await sideBar.assertAccountName('BOB');
        });
      });

      afterEach(() => {
        mockApiHooks.setJudgements([]);
      });
    });
  });
});
