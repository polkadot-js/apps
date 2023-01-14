// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { checkEndpoints } from './runner';

describe('--SLOW--: check configured chain endpoints', (): void => {
  beforeAll((): void => {
    jest.setTimeout(2 * 60 * 1000);
  });

  checkEndpoints('./.github/chain-endpoints.md', [
    'No DNS entry for',
    'Timeout connecting to',
    'Unable to initialize'
  ]);
});
