// Copyright 2017-2021 @polkadot/test-supports authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { fireEvent, screen, within } from '@testing-library/react';

export class JudgementTag {
  public judgementTag: HTMLElement

  constructor (judgementTag: HTMLElement) {
    this.judgementTag = judgementTag;
  }

  async assertRegistrars (expectedRegistrars: string[]): Promise<void> {
    const popup = await this.openPopup();

    for (let index = 0; index < expectedRegistrars.length; index++) {
      await within(popup).findByText(expectedRegistrars[index]);
    }
  }

  async clickRegistrar (registrar: string): Promise<void> {
    const popup = await this.openPopup();

    const registrars = await within(popup).findAllByTestId('account-name');

    const a = registrars.find((reg) => reg.textContent === registrar);

    fireEvent.click(a as HTMLElement);
  }

  private async openPopup (): Promise<HTMLElement> {
    fireEvent.click(this.judgementTag);

    return screen.findByTestId('popup-window');
  }
}
