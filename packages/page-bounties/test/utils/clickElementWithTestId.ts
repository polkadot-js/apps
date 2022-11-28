// Copyright 2017-2022 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { fireEvent } from '@testing-library/react';

export const clickElementWithTestId = async (testId: string, findByTestId: (testId: string) => Promise<HTMLElement>): Promise<void> => {
  const element = await findByTestId(testId);

  fireEvent.click(element);
};
