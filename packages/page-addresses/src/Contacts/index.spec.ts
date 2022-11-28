// Copyright 2017-2022 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { screen } from '@testing-library/react';

import i18next from '@polkadot/react-components/i18n';
import { aContactWithBalance } from '@polkadot/test-support/creation/contact';
import { MemoryStore } from '@polkadot/test-support/keyring';
import { Table } from '@polkadot/test-support/pagesElements';
import { balance } from '@polkadot/test-support/utils/balance';
import { keyring } from '@polkadot/ui-keyring';

import { AddressesPage } from '../../test/pages/addressesPage';

describe('Addresses page', () => {
  let addressesPage: AddressesPage;

  beforeAll(async () => {
    await i18next.changeLanguage('en');

    if (keyring.getAccounts().length === 0) {
      keyring.loadAll({ isDevelopment: true, store: new MemoryStore() });
    }
  });

  beforeEach(() => {
    addressesPage = new AddressesPage();
    addressesPage.clearAccounts();
  });

  describe('when no contacts', () => {
    let addressesTable: Table;

    beforeEach(async () => {
      addressesPage.render([]);
      addressesTable = await addressesPage.getTable();
    });

    it('shows a table', () => {
      expect(addressesTable).not.toBeNull();
    });

    it('the contacts table contains no contact rows', async () => {
      expect(await addressesTable.getRows()).toHaveLength(0);
    });

    it('the contacts table contains a message about no contacts available', async () => {
      const noContactsMessage = 'no addresses saved yet, add any existing address';

      await addressesTable.assertText(noContactsMessage);
    });

    it('no summary is displayed', () => {
      const summaries = screen.queryAllByTestId(/card-summary:total \w+/i);

      expect(summaries).toHaveLength(0);
    });
  });

  describe('when some contacts exist', () => {
    it('the contacts table contains some contact rows', async () => {
      addressesPage.renderDefaultContacts(2);
      const rows = await addressesPage.getAddressesRows();

      expect(rows).toHaveLength(2);
    });

    it('contact rows display the total balance info', async () => {
      addressesPage.renderContactsWithDefaultAddresses(
        aContactWithBalance({ freeBalance: balance(500) }),
        aContactWithBalance({ freeBalance: balance(200), reservedBalance: balance(150) })
      );

      const rows = await addressesPage.getAddressesRows();

      await rows[0].assertBalancesTotal(balance(500));
      await rows[1].assertBalancesTotal(balance(350));
    });

    it('contact rows display the details balance info', async () => {
      addressesPage.renderContactsWithDefaultAddresses(
        aContactWithBalance({ freeBalance: balance(500), lockedBalance: balance(30) }),
        aContactWithBalance({ availableBalance: balance(50), freeBalance: balance(200), reservedBalance: balance(150) })
      );

      const rows = await addressesPage.getAddressesRows();

      await rows[0].assertBalancesDetails([
        { amount: balance(0), name: 'transferrable' },
        { amount: balance(30), name: 'locked' }]);
      await rows[1].assertBalancesDetails([
        { amount: balance(50), name: 'transferrable' },
        { amount: balance(150), name: 'reserved' }]);
    });

    it('when a contact is not tagged, details row displays no tags info', async () => {
      addressesPage.renderDefaultContacts(1);
      const rows = await addressesPage.getAddressesRows();

      await rows[0].assertTags('no tags');
    });

    it('when a contact is tagged, the details row displays tags', async () => {
      const injectedAddress = '5CMCFVfsauWXmKaUB6tbznVUpBxcUZyU78DzvPTYrhdXe8Xp';

      addressesPage.renderContacts([
        [injectedAddress, { meta: { tags: ['my tag', 'Super Tag'] } }]
      ]);

      const rows = await addressesPage.getAddressesRows();

      expect(rows).toHaveLength(1);

      await rows[0].assertTags('Super Tagmy tag');
    });

    it('contact details rows toggled on icon toggle click', async () => {
      addressesPage.renderDefaultContacts(1);
      const row = (await addressesPage.getAddressesRows())[0];

      expect(row.detailsRow).toHaveClass('isCollapsed');

      await row.expand();

      expect(row.detailsRow).toHaveClass('isExpanded');
    });
  });
});
