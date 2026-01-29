// Copyright 2017-2025 @polkadot/app-addresses authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* global jest */

import type { Row } from '@polkadot/test-support/pagesElements';
import type { AccountOverrides as ContactOverrides } from '@polkadot/test-support/types';

import React from 'react';

import { aContact } from '@polkadot/test-support/creation/contact';
import { Page } from '@polkadot/test-support/pages/Page';
import { mockAccountHooks } from '@polkadot/test-support/utils';

import AddressOverview from '../../src/Contacts/index.js';

const NOOP_CHANGE = () => undefined;

jest.mock('@polkadot/react-hooks/useAddresses', () => ({
  useAddresses: () => ({
    allAddresses: mockAccountHooks.useAccounts.allAccounts,
    hasAddresses: mockAccountHooks.useAccounts.hasAccounts,
    isAddress: true
  })
}));

export class AddressesPage extends Page {
  constructor () {
    super(
      <AddressOverview onStatusChange={NOOP_CHANGE} />,
      'Address-'
    );
  }

  async getAddressesRows (): Promise<Row[]> {
    const addressesTable = await this.getTable();

    return addressesTable.getRows();
  }

  renderDefaultContacts (contactsNumber: number): void {
    const contacts = Array.from({ length: contactsNumber },
      (_, index) => [this.defaultAddresses[index], aContact()] as [string, ContactOverrides]);

    this.render(contacts);
  }

  renderContactsWithDefaultAddresses (...overrides: ContactOverrides[]): void {
    const contacts = overrides.map((contactProperties, index) =>
      [this.defaultAddresses[index], contactProperties] as [string, ContactOverrides]);

    this.render(contacts);
  }

  renderContactsForAddresses (...addresses: string[]): void {
    const contacts = addresses.map((address) => [address, aContact()] as [string, ContactOverrides]);

    this.render(contacts);
  }

  renderContacts (contacts: [string, ContactOverrides][]): void {
    this.render(contacts);
  }
}
