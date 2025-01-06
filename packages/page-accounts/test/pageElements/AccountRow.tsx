// Copyright 2017-2025 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* global expect */

import { within } from '@testing-library/react';

import { Row } from '@polkadot/test-support/pagesElements';

export class AccountRow extends Row {
  async assertParentAccountName (expectedParentAccount: string): Promise<void> {
    const parentAccount = await within(this.primaryRow).findByTestId('parent');

    expect(parentAccount).toHaveTextContent(expectedParentAccount);
  }
}
