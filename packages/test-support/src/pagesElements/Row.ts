// Copyright 2017-2021 @polkadot/test-supports authors & contributors
// SPDX-License-Identifier: Apache-2.0

// utility wrapper over an account item in accounts table, serves basic assertions about an account row
import { fireEvent, screen, within } from '@testing-library/react';

import { Sidebar } from '@polkadot/test-support/pagesElements/Sidebar';
import { Balance } from '@polkadot/types/interfaces';

import { format } from '../utils/balance';

export class Row {
  public primaryRow: HTMLElement;
  public detailsRow: HTMLElement;
  public rowIndex: number;

  constructor (primaryRow: HTMLElement, detailsRow: HTMLElement, rowIndex: number) {
    this.primaryRow = primaryRow;
    this.detailsRow = detailsRow;
    this.rowIndex = rowIndex;
  }

  async assertBalancesTotal (expectedTotalBalance: Balance): Promise<void> {
    const actualBalanceText = await this.getBalanceSummary();
    const expectedBalanceText = format(expectedTotalBalance);

    expect(actualBalanceText).toHaveTextContent(expectedBalanceText);
  }

  async getBalanceSummary (): Promise<HTMLElement> {
    return within(this.primaryRow).findByTestId('balance-summary');
  }

  async assertAccountName (expectedName: string): Promise<void> {
    const accountName = await this.getAccountName();

    expect(accountName).toHaveTextContent(expectedName);
  }

  async assertBalancesDetails (expectedBalanceComponents: { name: string, amount: Balance }[]): Promise<void> {
    for (const { amount, name } of expectedBalanceComponents) {
      await this.assertBalanceComponent({ amount, name });
    }
  }

  async assertTags (expectedTagsContent: string): Promise<void> {
    const actualTags = await within(this.detailsRow).findByTestId('tags');

    expect(actualTags).toHaveTextContent(expectedTagsContent);
  }

  async assertShortAddress (expectedShortAddress: string): Promise<void> {
    const actualShortAddress = await within(this.primaryRow).findByTestId('short-address');

    expect(actualShortAddress).toHaveTextContent(expectedShortAddress);
  }

  assertColoring (): void {
    const expectedColorClass = this.getExpectedColorClass();

    expect(this.primaryRow).toHaveClass(expectedColorClass);
    expect(this.detailsRow).toHaveClass(expectedColorClass);
  }

  async expand (): Promise<void> {
    const toggle = await within(this.primaryRow).findByTestId('row-toggle');

    fireEvent.click(toggle);
  }

  async openSidebar (): Promise<Sidebar> {
    const accountName = await this.getAccountName();

    fireEvent.click(accountName);

    return new Sidebar(await screen.findByTestId('account-sidebar'));
  }

  private async assertBalanceComponent (expectedBalanceComponent: { name: string; amount: Balance }): Promise<void> {
    const balanceElement = await this.getBalanceElementByLabelName(expectedBalanceComponent.name);
    const balanceText = format(expectedBalanceComponent.amount);

    expect(balanceElement).toHaveTextContent(balanceText);
  }

  private async getBalanceElementByLabelName (labelName: string): Promise<ChildNode | null> {
    const labelElement = await within(this.detailsRow).findByText(labelName);

    return labelElement.nextSibling;
  }

  private getAccountName (): Promise<HTMLElement> {
    return within(this.primaryRow).findByTestId('account-name');
  }

  private getExpectedColorClass (): string {
    return this.rowIndex % 2 ? 'isEven' : 'isOdd';
  }
}
