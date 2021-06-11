// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { truncateTitle } from './stringHelpers';

describe('Truncate title', () => {
  it('does not truncate short title', () => {
    expect(truncateTitle('a short one', 30)).toEqual('a short one');
  });

  it('truncates a long title', () => {
    const ellipsis = String.fromCharCode(8230);

    expect(truncateTitle('A long title that should got truncated', 30)).toEqual(`A long title that should got ${ellipsis}`);
  });
});
