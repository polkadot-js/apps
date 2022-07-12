// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { checkEndpoints } from './runner';

describe.skip('--SLOW--: check configured chain types', (): void => {
  beforeAll((): void => {
    jest.setTimeout(2 * 60 * 1000);
  });

  checkEndpoints('./.github/chain-types.md', [
    'Unknown types'
  ]);
});
