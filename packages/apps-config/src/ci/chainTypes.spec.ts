// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { checkEndpoints } from './util';

describe('--SLOW--: check configured chain types', (): void => {
  checkEndpoints('./.github/chain-types.md', [
    'Unknown types'
  ]);
});
