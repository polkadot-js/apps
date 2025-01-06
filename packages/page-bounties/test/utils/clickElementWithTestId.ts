// Copyright 2017-2025 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { fireEvent } from '@testing-library/react';

import { nextTick } from '@polkadot/util';

export async function clickElementWithTestId (testId: string, findByTestId: (testId: string) => Promise<HTMLElement>): Promise<void> {
  const element = await findByTestId(testId);

  // we have an issue with Popups... wait for rendering
  await new Promise<void>((resolve): void => {
    nextTick(resolve);
  });

  fireEvent.click(element);
}
