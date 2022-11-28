// Copyright 2017-2022 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { fireEvent } from '@testing-library/react';

export async function clickButtonWithName (buttonName: string, findByRole: (...args: any[]) => Promise<HTMLElement>): Promise<void> {
  const button = await findByRole('button', { name: buttonName });

  fireEvent.click(button);
}
