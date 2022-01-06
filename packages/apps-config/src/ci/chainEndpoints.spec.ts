// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { checkEndpoints } from './util';

describe('--SLOW--: check configured chain endpoints', (): void => {
  checkEndpoints('./.github/chain-endpoints.md', [
    'No DNS entry for',
    'Timeout connecting to',
    'Unable to initialize'
  ]);
});
