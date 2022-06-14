// Copyright 2017-2022 @polkadot/test-supports authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { fireEvent, screen } from '@testing-library/react';

export const clickButton = async (buttonName: string): Promise<void> => {
  const button = await screen.findByRole('button', { name: buttonName });

  fireEvent.click(button);
};

export const assertText = async (text: string): Promise<HTMLElement> => {
  return screen.findByText(text);
};

export const fillInput = (inputTestId: string, value: string): void => {
  const nameInput = screen.getByTestId(inputTestId);

  fireEvent.change(nameInput, { target: { value } });
};

export const assertButtonDisabled = (buttonName: string): void => {
  const button = screen.getByRole('button', { name: buttonName });

  expect(button).toHaveClass('isDisabled');
};
