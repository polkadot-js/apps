// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { fireEvent } from '@testing-library/react';

export const clickButtonWithName = async (buttonName: string, findByRole: (...args: any[]) => Promise<HTMLElement>): Promise<void> => {
  const button = await findByRole('button', { name: buttonName });

  fireEvent.click(button);
};
