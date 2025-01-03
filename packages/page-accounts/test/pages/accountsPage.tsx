// Copyright 2017-2025 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Sidebar } from '@polkadot/test-support/pagesElements';
import type { AccountOverrides } from '@polkadot/test-support/types';

import { fireEvent, screen, within } from '@testing-library/react';
import React from 'react';

import { anAccount } from '@polkadot/test-support/creation/account';
import { Page } from '@polkadot/test-support/pages/Page';
import { assertText, clickButton } from '@polkadot/test-support/utils';
import { settings } from '@polkadot/ui-settings';

import AccountOverview from '../../src/Accounts/index.js';
import { AccountRow } from '../pageElements/AccountRow.js';

const NOOP_CHANGE = () => undefined;

// set the account creation for localStorage to on
settings.set({ ...settings.get(), storage: 'on' });

export class AccountsPage extends Page {
  constructor () {
    super(
      <AccountOverview onStatusChange={NOOP_CHANGE} />,
      'Account-'
    );
  }

  async getAccountRows (): Promise<AccountRow[]> {
    const table = await this.getTable();
    const rows = await table.getRows();

    return rows.map((row) => new AccountRow(row.primaryRow, row.detailsRow));
  }

  async reverseSortingOrder (): Promise<void> {
    const sortingComponent = await this.getSortByComponent();
    const reverseOrderButton = await within(sortingComponent).findByRole('button');

    fireEvent.click(reverseOrderButton);
  }

  async sortBy (category: string): Promise<void> {
    const currentCategory = await this.getCurrentSortCategory();

    fireEvent.click(currentCategory);

    const selectedCategory = await this.getSortCategory(category);

    fireEvent.click(selectedCategory);
  }

  async getCurrentSortCategory (): Promise<HTMLElement> {
    const sortByComponent = await this.getSortByComponent();

    return within(sortByComponent).findByRole('alert');
  }

  async enterCreateAccountModal (): Promise<void> {
    this.render([]);
    await clickButton('Account');

    await assertText('Add an account via seed 1/3');
  }

  renderAccountsWithDefaultAddresses (...overrides: AccountOverrides[]): void {
    const accounts = overrides.map((accountProperties, index) =>
      [this.defaultAddresses[index], accountProperties] as [string, AccountOverrides]);

    this.render(accounts);
  }

  renderAccountsForAddresses (...addresses: string[]): void {
    const accounts = addresses.map((address) => [address, anAccount()] as [string, AccountOverrides]);

    this.render(accounts);
  }

  renderDefaultAccounts (accountsNumber: number): void {
    const accounts = Array.from({ length: accountsNumber },
      (_, index) => [this.defaultAddresses[index], anAccount()] as [string, AccountOverrides]);

    this.render(accounts);
  }

  async openSidebarForRow (accountRowIndex: number): Promise<Sidebar> {
    const accountRows = await this.getAccountRows();

    return accountRows[accountRowIndex].openSidebar();
  }

  private async getSortCategory (categoryName: string): Promise<HTMLElement> {
    const sortByComponent = await this.getSortByComponent();
    const availableCategories = await within(sortByComponent).findAllByRole('option');
    const selectedCategory = availableCategories.find((category) => category.textContent === categoryName);

    if (!selectedCategory) {
      throw new Error('No category found');
    }

    return selectedCategory;
  }

  private async getSortByComponent (): Promise<HTMLElement> {
    this.assertRendered();

    return await screen.findByTestId('sort-by-section');
  }
}
