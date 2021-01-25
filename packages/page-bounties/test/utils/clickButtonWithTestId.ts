// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { fireEvent } from '@testing-library/react';

export const clickButtonWithTestId = async (buttonTestId: string, findByTestId: (testId: string) => Promise<HTMLElement>): Promise<void> => {
  const button = await findByTestId(buttonTestId);

  fireEvent.click(button);
};
