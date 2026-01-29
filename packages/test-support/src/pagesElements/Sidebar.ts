// Copyright 2017-2025 @polkadot/test-supports authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* global expect */

import { fireEvent, screen, within } from '@testing-library/react';

import { JudgementTag } from './JudgementTag.js';

export class Sidebar {
  public sidebar: HTMLElement;

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
    const tag = tagOptions.find((tag) => tag.textContent === tagName);

    if (!tag) {
      throw new Error(`Unable to find tag ${tagName}`);
    }

    fireEvent.click(tag);
  }

  async assertAccountInput (expectedInput: string): Promise<void> {
    const nameInput = await this.findByTestId('name-input');

    expect(nameInput).toHaveProperty('value', expectedInput);
  }

  async assertAccountName (expectedAccountName: string): Promise<void> {
    const sideBarAddressSection = await this.findByTestId('sidebar-address-menu');
    const sideBarName = await within(sideBarAddressSection).findByTestId('account-name');

    expect(sideBarName).toHaveTextContent(expectedAccountName);
  }

  async assertJudgement (judgement: string): Promise<void> {
    const judgementsSection = await this.findByTestId('judgements');

    expect(judgementsSection).toHaveTextContent(judgement);
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

  async findSubs (): Promise<HTMLElement[]> {
    const identitySection = await this.findByTestId('identity-section');

    return within(identitySection).queryAllByTestId('subs');
  }

  async openSubsModal (): Promise<HTMLElement> {
    const identitySection = await this.findByTestId('identity-section');
    const showSubsButton = await within(identitySection).findByText('Show list');

    fireEvent.click(showSubsButton);

    return screen.findByTestId('modal');
  }

  async getJudgement (judgementName: string): Promise<JudgementTag> {
    const judgements = await this.findByTestId('judgements');

    return new JudgementTag(await within(judgements).findByText(judgementName));
  }

  private clickButton (buttonName: string) {
    const button = this.getByRole('button', { name: buttonName });

    fireEvent.click(button);
  }

  private openTagsDropdown (): HTMLElement {
    const tagsDropdown = this.getByRole('combobox', { expanded: false });

    fireEvent.click(tagsDropdown);

    return tagsDropdown;
  }
}
