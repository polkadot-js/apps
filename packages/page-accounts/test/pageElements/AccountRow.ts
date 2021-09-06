// Copyright 2017-2021 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { fireEvent, screen, within } from '@testing-library/react';

import { Balance } from '@polkadot/types/interfaces';

import { format } from '../pages/accountsPage';
import { Sidebar } from './Sidebar';

// utility wrapper over an account item in accounts table, serves basic assertions about an account row

export class AccountRow {
  public primaryRow: HTMLElement;
  public detailsRow: HTMLElement;

  constructor (primaryRow: HTMLElement, detailsRow: HTMLElement) {
    this.primaryRow = primaryRow;
    this.detailsRow = detailsRow;
  }

  async assertBalancesTotal (expected: Balance): Promise<void> {
    const balanceActual = await within(this.primaryRow).findByTestId('balance-summary');
    const balanceExpected = format(expected);

    expect(balanceActual).toHaveTextContent(balanceExpected);
  }

  async assertBalancesDetails (expected: {name: string, amount: Balance}[]): Promise<void> {
    for (const expectedBalanceDetailsItem of expected) {
      const labelElement = await within(this.detailsRow).findByText(expectedBalanceDetailsItem.name);
      const balanceElement = labelElement.nextSibling;
      const amount = format(expectedBalanceDetailsItem.amount);

      expect(balanceElement).toHaveTextContent(amount);
    }
  }

  async assertAccountName (expectedName: string): Promise<void> {
    const accountName = await within(this.primaryRow).findByTestId('account-name');

    expect(accountName).toHaveTextContent(expectedName);
  }

  async assertParentAccountName (expectedParentAccount: string): Promise<void> {
    const parentAccount = await within(this.primaryRow).findByTestId('parent');

    expect(parentAccount).toHaveTextContent(expectedParentAccount);
  }

  async assertTags (tagsContent: string): Promise<void> {
    const tagsActual = await within(this.detailsRow).findByTestId('tags');

    expect(tagsActual).toHaveTextContent(tagsContent);
  }

  async assertShortAddress (expectedShortAddress: string): Promise<void> {
    const actualShortAddress = await within(this.primaryRow).findByTestId('short-address');

    expect(actualShortAddress).toHaveTextContent(expectedShortAddress);
  }

  async openSidebar (): Promise<Sidebar> {
    const accountName = await within(this.primaryRow).findByTestId('account-name');

    fireEvent.click(accountName);

    return new Sidebar(await screen.findByTestId('account-sidebar'));
  }
}
