// Copyright 2017-2021 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { fireEvent, within } from '@testing-library/react';

export class Sidebar {
  public sidebar: HTMLElement

  constructor (sidebar: HTMLElement) {
    this.sidebar = sidebar;
  }

  async changeAccountName (accountName: string): Promise<void> {
    this.edit();
    await this.typeAccountName(accountName);
    this.save();
  }

  async typeAccountName (accountName: string): Promise<void> {
    const accountNameInput = await this.findByTestId('name-input');

    fireEvent.change(accountNameInput, { target: { value: accountName } });
  }

  async selectTag (tagName: string): Promise<void> {
    const tagsCombobox = this.openTagsDropdown();
    const tagOptions = await within(tagsCombobox).findAllByRole('option');
    const tag = tagOptions.find((tag) => tag.textContent === tagName) as HTMLElement;

    fireEvent.click(tag);
  }

  async assertAccountInput (expectedInput: string): Promise<void> {
    const sideBarName = await this.findByTestId('name-input');

    expect(sideBarName).toHaveProperty('value', expectedInput);
  }

  async assertAccountName (expectedAccountName: string): Promise<void> {
    const sideBarName = await this.findByTestId('account-name');

    expect(sideBarName).toHaveTextContent(expectedAccountName);
  }

  async assertTags (tagsContent: string): Promise<void> {
    const sideBarTags = await this.findByTestId('sidebar-tags');

    expect(sideBarTags).toHaveTextContent(tagsContent);
  }

  close (): Promise<void> {
    return this.clickByTestId('close-sidebar-button');
  }

  cancel (): void {
    this.clickButton('Cancel');
  }

  edit (): void {
    this.clickButton('Edit');
  }

  save (): void {
    this.clickButton('Save');
  }

  async clickByText (text: string): Promise<void> {
    const htmlElement = await this.findByText(text);

    fireEvent.click(htmlElement);
  }

  async clickByTestId (testId: string): Promise<void> {
    const htmlElement = await this.findByTestId(testId);

    fireEvent.click(htmlElement);
  }

  async findByText (text: string): Promise<HTMLElement> {
    return within(this.sidebar).findByText(text);
  }

  async findByTestId (testId: string): Promise<HTMLElement> {
    return within(this.sidebar).findByTestId(testId);
  }

  async findByRole (role: string): Promise<HTMLElement> {
    return within(this.sidebar).findByRole(role);
  }

  async findAllByRole (role: string): Promise<HTMLElement[]> {
    return within(this.sidebar).findAllByRole(role);
  }

  getByTestId (testId: string): HTMLElement {
    return within(this.sidebar).getByTestId(testId);
  }

  getByRole (roleName: string, options?: Record<string, unknown>): HTMLElement {
    return within(this.sidebar).getByRole(roleName, options);
  }

  queryByRole (roleName: string, options?: Record<string, unknown>): HTMLElement | null {
    return within(this.sidebar).queryByRole(roleName, options);
  }

  queryByTestId (testId: string): HTMLElement | null {
    return within(this.sidebar).queryByTestId(testId);
  }

  private clickButton (buttonName: string) {
    const saveButton = this.getByRole('button', { name: buttonName });

    fireEvent.click(saveButton);
  }

  private openTagsDropdown (): HTMLElement {
    const tagsDropdown = this.getByRole('combobox', { expanded: false });

    fireEvent.click(tagsDropdown);

    return tagsDropdown;
  }
}
