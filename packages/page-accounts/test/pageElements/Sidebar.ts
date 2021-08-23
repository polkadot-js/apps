// Copyright 2017-2021 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { fireEvent, within } from '@testing-library/react';

export class Sidebar {
  public sidebar: HTMLElement

  constructor (sidebar: HTMLElement) {
    this.sidebar = sidebar;
  }

  async clickByText (text: string): Promise<void> {
    const htmlElement = await this.findByText(text);

    this.clickElement(htmlElement);
  }

  async typeAccountName (accountName: string): Promise<void> {
    const accountNameInput = await this.findByTestId('name-input');

    fireEvent.change(accountNameInput, { target: { value: accountName } });
  }

  async selectAccountTag (tagName: string): Promise<void> {
    const tagsSelector = this.getByRole('combobox');

    this.clickElement(tagsSelector);

    await this.clickByText(tagName);
  }

  async assertAccountName (expectedAccountName: string): Promise<void> {
    const sideBarName = await this.findByTestId('account-name');

    expect(sideBarName).toHaveTextContent(expectedAccountName);
  }

  async assertTags (tagsContent: string): Promise<void> {
    const sideBarTags = await this.findByTestId('sidebar-tags');

    expect(sideBarTags).toHaveTextContent(tagsContent);
  }

  clickElement (element: HTMLElement): void {
    fireEvent.click(element);
  }

  async findByText (text: string): Promise<HTMLElement> {
    return within(this.sidebar).findByText(text);
  }

  async findByTestId (testId: string): Promise<HTMLElement> {
    return within(this.sidebar).findByTestId(testId);
  }

  getByTestId (testId: string): HTMLElement {
    return within(this.sidebar).getByTestId(testId);
  }

  getByRole (roleName: string): HTMLElement {
    return within(this.sidebar).getByRole(roleName);
  }

  queryByRole (roleName: string): HTMLElement | null {
    return within(this.sidebar).queryByRole(roleName);
  }

  queryByTestId (testId: string): HTMLElement | null {
    return within(this.sidebar).queryByTestId(testId);
  }
}
