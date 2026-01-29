// Copyright 2017-2025 @polkadot/test-supports authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* global fail */

import { fireEvent, screen, within } from '@testing-library/react';

export class JudgementTag {
  public judgementTag: HTMLElement;

  constructor (judgementTag: HTMLElement) {
    this.judgementTag = judgementTag;
  }

  async assertRegistrars (expectedRegistrars: string[]): Promise<void> {
    const popup = await this.openPopup();

    for (let index = 0, count = expectedRegistrars.length; index < count; index++) {
      await within(popup).findByText(expectedRegistrars[index]);
    }
  }

  async clickRegistrar (registrarName: string): Promise<void> {
    const popup = await this.openPopup();

    const registrars = await within(popup).findAllByTestId('account-name');

    const registrar = registrars.find((reg) => reg.textContent === registrarName) ?? fail('Registrar not found');

    fireEvent.click(registrar);
  }

  private async openPopup (): Promise<HTMLElement> {
    fireEvent.click(this.judgementTag);

    return screen.findByTestId('popup-window');
  }
}
