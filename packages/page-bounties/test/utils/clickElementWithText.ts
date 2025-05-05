// Copyright 2017-2025 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { fireEvent } from '@testing-library/react';

export async function clickElementWithText (text: string, findByText: (name: string) => Promise<HTMLElement>): Promise<void> {
  const element = await findByText(text);

  fireEvent.click(element);
}
